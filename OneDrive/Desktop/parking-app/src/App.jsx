import React, { useState, useMemo, useCallback } from "react";
import "./App.css";
import {
  Car,
  Search,
  Download,
  X,
  Check,
  Clock,
  History,
  LayoutGrid,
  CircleCheck,
  CircleX,
  User,
  Phone,
  Hash,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOTAL_SLOTS = 20;

const PRESET_OWNERS = [
  { name: "Vasu Kaneriya", vehicle: "GJ05AB1234", mobile: "9876543210" },
  { name: "Rahul Patel", vehicle: "GJ01AB1111", mobile: "9123456780" },
  { name: "Aarav Mehta", vehicle: "MH12CD5678", mobile: "9988776655" },
  { name: "Priya Shah", vehicle: "GJ06XY7890", mobile: "9001122334" },
  { name: "Karan Joshi", vehicle: "RJ14EF3456", mobile: "9876012345" },
  { name: "Diya Verma", vehicle: "DL08GH2468", mobile: "9090909090" },
];

function formatDateTime(date = new Date()) {
  const d = date;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h === 0 ? 12 : h;
  const hh = String(h).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min} ${ampm}`;
}

function buildInitialState() {
  const slots = [];
  const bookings = {};
  for (let i = 1; i <= TOTAL_SLOTS; i++) {
    slots.push({ number: `P${i}`, status: "Available" });
  }
  // Seed 6 booked slots to match the spec's example dashboard (20 / 14 / 6)
  const seededIndices = [2, 5, 8, 11, 14, 17]; // P3, P6, P9, P12, P15, P18
  seededIndices.forEach((idx, i) => {
    const slot = slots[idx];
    slot.status = "Booked";
    const owner = PRESET_OWNERS[i % PRESET_OWNERS.length];
    bookings[slot.number] = {
      slotNumber: slot.number,
      ownerName: owner.name,
      vehicleNumber: owner.vehicle,
      mobileNumber: owner.mobile,
      bookingDateTime: formatDateTime(
        new Date(Date.now() - (i + 1) * 36e5)
      ),
      status: "Booked",
    };
  });
  return { slots, bookings };
}

// Validation -----------------------------------------------------------------

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

function validateField(field, value) {
  const v = (value || "").trim();
  if (field === "ownerName") {
    if (!v) return "Owner name is required";
    if (v.length < 3) return "Minimum 3 characters required";
    return "";
  }
  if (field === "vehicleNumber") {
    if (!v) return "Vehicle number is required";
    if (!VEHICLE_REGEX.test(v.toUpperCase()))
      return "Use a valid Indian format e.g. GJ05AB1234";
    return "";
  }
  if (field === "mobileNumber") {
    if (!v) return "Mobile number is required";
    if (!MOBILE_REGEX.test(v)) return "Enter exactly 10 digits";
    return "";
  }
  return "";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value, accent, Icon }) {
  return (
    <div className="relative flex-1 min-w-[140px] rounded-md border-2 border-[var(--asphalt)] bg-[var(--concrete)] px-5 py-4 overflow-hidden">
      <div
        className="absolute top-0 left-0 h-1.5 w-full"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--asphalt)]/70">
          {label}
        </span>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div
        className="mt-1 font-mono text-3xl font-bold tracking-tight text-[var(--asphalt)]"
      >
        {value}
      </div>
    </div>
  );
}

function SlotTile({ slot, onClick }) {
  const isAvailable = slot.status === "Available";
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center rounded-sm border-2 px-2 py-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        borderColor: isAvailable ? "var(--safety-green)" : "var(--alert-red)",
        background: isAvailable
          ? "color-mix(in srgb, var(--safety-green) 8%, var(--concrete))"
          : "color-mix(in srgb, var(--alert-red) 8%, var(--concrete))",
        "--tw-ring-color": isAvailable ? "var(--safety-green)" : "var(--alert-red)",
      }}
      title={isAvailable ? "Tap to book this slot" : "Tap to view booking"}
    >
      {/* perforated ticket notch */}
      <span
        className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--asphalt)]"
        aria-hidden
      />
      <span className="font-mono text-lg font-bold tracking-widest text-[var(--asphalt)]">
        {slot.number}
      </span>
      <span
        className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{
          color: isAvailable ? "var(--safety-green)" : "var(--alert-red)",
        }}
      >
        {isAvailable ? <CircleCheck size={11} /> : <CircleX size={11} />}
        {slot.status}
      </span>
    </button>
  );
}

function BookingModal({ slot, onClose, onSubmit }) {
  const [form, setForm] = useState({
    ownerName: "",
    vehicleNumber: "",
    mobileNumber: "",
  });
  const [touched, setTouched] = useState({});
  const errors = {
    ownerName: validateField("ownerName", form.ownerName),
    vehicleNumber: validateField("vehicleNumber", form.vehicleNumber),
    mobileNumber: validateField("mobileNumber", form.mobileNumber),
  };
  const isValid = !errors.ownerName && !errors.vehicleNumber && !errors.mobileNumber;

  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === "vehicleNumber") val = val.toUpperCase();
    if (field === "mobileNumber") val = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ ownerName: true, vehicleNumber: true, mobileNumber: true });
    if (!isValid) return;
    onSubmit({
      slotNumber: slot.number,
      ownerName: form.ownerName.trim(),
      vehicleNumber: form.vehicleNumber.trim(),
      mobileNumber: form.mobileNumber.trim(),
      bookingDateTime: formatDateTime(),
      status: "Booked",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-md border-2 border-[var(--asphalt)] bg-[var(--concrete)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-[var(--asphalt)]/60 hover:bg-black/5 hover:text-[var(--asphalt)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div
          className="absolute -top-3 left-6 rounded-sm px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-white"
          style={{ background: "var(--safety-green)" }}
        >
          {slot.number}
        </div>
        <h2 className="mt-2 font-mono text-lg font-bold uppercase tracking-wide text-[var(--asphalt)]">
          Book this slot
        </h2>
        <p className="mb-4 text-xs text-[var(--asphalt)]/60">
          Fill in driver details to reserve {slot.number}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field
            label="Owner name"
            value={form.ownerName}
            onChange={handleChange("ownerName")}
            onBlur={() => setTouched((t) => ({ ...t, ownerName: true }))}
            error={touched.ownerName && errors.ownerName}
            placeholder="Vasu Kaneriya"
            Icon={User}
          />
          <Field
            label="Vehicle number"
            value={form.vehicleNumber}
            onChange={handleChange("vehicleNumber")}
            onBlur={() => setTouched((t) => ({ ...t, vehicleNumber: true }))}
            error={touched.vehicleNumber && errors.vehicleNumber}
            placeholder="GJ05AB1234"
            Icon={Car}
          />
          <Field
            label="Mobile number"
            value={form.mobileNumber}
            onChange={handleChange("mobileNumber")}
            onBlur={() => setTouched((t) => ({ ...t, mobileNumber: true }))}
            error={touched.mobileNumber && errors.mobileNumber}
            placeholder="9876543210"
            Icon={Phone}
            inputMode="numeric"
          />

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--asphalt)" }}
          >
            <Check size={16} /> Confirm booking
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, onBlur, error, placeholder, Icon, inputMode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--asphalt)]/70">
        {label}
      </span>
      <span className="relative flex items-center">
        <Icon size={14} className="absolute left-2.5 text-[var(--asphalt)]/40" />
        <input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          className="w-full rounded-sm border-2 bg-white py-2 pl-8 pr-2 text-sm font-medium text-[var(--asphalt)] outline-none transition-colors"
          style={{
            borderColor: error ? "var(--alert-red)" : "var(--asphalt)",
          }}
        />
      </span>
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-[var(--alert-red)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function DetailsModal({ booking, onClose, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-md border-2 border-[var(--asphalt)] bg-[var(--concrete)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-[var(--asphalt)]/60 hover:bg-black/5 hover:text-[var(--asphalt)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div
          className="absolute -top-3 left-6 rounded-sm px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-white"
          style={{ background: "var(--alert-red)" }}
        >
          {booking.slotNumber}
        </div>
        <h2 className="mt-2 font-mono text-lg font-bold uppercase tracking-wide text-[var(--asphalt)]">
          Booking details
        </h2>

        <dl className="mt-4 space-y-2.5 text-sm">
          <Row label="Owner" value={booking.ownerName} />
          <Row label="Vehicle no." value={booking.vehicleNumber} />
          <Row label="Mobile" value={booking.mobileNumber} />
          <Row label="Booked at" value={booking.bookingDateTime} />
        </dl>

        <button
          onClick={() => onCancel(booking.slotNumber)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border-2 border-[var(--alert-red)] py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-[var(--alert-red)] transition-colors hover:bg-[var(--alert-red)] hover:text-white"
        >
          <X size={16} /> Cancel booking
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-[var(--asphalt)]/20 pb-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--asphalt)]/60">
        {label}
      </dt>
      <dd className="font-mono text-sm font-bold text-[var(--asphalt)]">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------

export default function ParkingSlotBooking() {
  const [{ slots, bookings }, setState] = useState(buildInitialState);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [bookingSlot, setBookingSlot] = useState(null); // slot being booked
  const [detailsSlot, setDetailsSlot] = useState(null); // slot number whose details are open
  const [toast, setToast] = useState(null);

  const totalSlots = slots.length;
  const availableCount = slots.filter((s) => s.status === "Available").length;
  const bookedCount = totalSlots - availableCount;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const handleSlotClick = (slot) => {
    if (slot.status === "Available") {
      setBookingSlot(slot);
    } else {
      setDetailsSlot(slot.number);
    }
  };

  const handleBook = (booking) => {
    setState((prev) => ({
      slots: prev.slots.map((s) =>
        s.number === booking.slotNumber ? { ...s, status: "Booked" } : s
      ),
      bookings: { ...prev.bookings, [booking.slotNumber]: booking },
    }));
    setBookingSlot(null);
    showToast(`${booking.slotNumber} booked for ${booking.ownerName}`);
  };

  const handleCancel = (slotNumber) => {
    setState((prev) => {
      const cancelled = prev.bookings[slotNumber];
      if (cancelled) {
        setHistory((h) => [
          { ...cancelled, cancelledAt: formatDateTime() },
          ...h.filter((entry) => entry.slotNumber !== slotNumber),
        ]);
      }
      const nextBookings = { ...prev.bookings };
      delete nextBookings[slotNumber];
      return {
        slots: prev.slots.map((s) =>
          s.number === slotNumber ? { ...s, status: "Available" } : s
        ),
        bookings: nextBookings,
      };
    });
    setDetailsSlot(null);
    showToast(`${slotNumber} booking cancelled`);
  };

  const handleExport = () => {
    const payload = {
      activeBookings: Object.values(bookings),
      bookingHistory: history,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("bookings.json downloaded");
  };

  const filteredSlots = useMemo(() => {
    let list = slots;
    if (filter === "Available") list = list.filter((s) => s.status === "Available");
    if (filter === "Booked") list = list.filter((s) => s.status === "Booked");

    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((s) => {
      const b = bookings[s.number];
      const haystack = [
        s.number,
        b?.ownerName,
        b?.vehicleNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [slots, filter, search, bookings]);

  const activeBookingsList = Object.values(bookings).sort((a, b) =>
    a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true })
  );

  return (
    <div
      className="min-h-full w-full font-sans"
      style={{
        "--asphalt": "#1C1F26",
        "--concrete": "#F2F0EA",
        "--safety-green": "#2E7D5B",
        "--alert-red": "#C44536",
        "--paint-yellow": "#F4B400",
        background: "var(--concrete)",
        color: "var(--asphalt)",
      }}
    >
      {/* Header strip */}
      <header
        className="relative overflow-hidden px-5 py-6 sm:px-8"
        style={{ background: "var(--asphalt)" }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-1.5"
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--paint-yellow) 0 28px, transparent 28px 44px)",
          }}
        />
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-sm"
            style={{ background: "var(--paint-yellow)" }}
          >
            <Car size={20} color="var(--asphalt)" />
          </span>
          <div>
            <h1 className="font-mono text-xl font-bold uppercase tracking-[0.08em] text-white">
              ParkEasy Lot
            </h1>
            <p className="text-xs font-medium text-white/50">
              Slot booking &amp; dispatch console
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
        {/* Dashboard */}
        <section className="mb-7 flex flex-wrap gap-3">
          <StatCard
            label="Total slots"
            value={totalSlots}
            accent="var(--asphalt)"
            Icon={LayoutGrid}
          />
          <StatCard
            label="Available"
            value={availableCount}
            accent="var(--safety-green)"
            Icon={CircleCheck}
          />
          <StatCard
            label="Booked"
            value={bookedCount}
            accent="var(--alert-red)"
            Icon={CircleX}
          />
        </section>

        {/* Controls */}
        <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--asphalt)]/40"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search slot, owner or vehicle..."
              className="w-full rounded-sm border-2 border-[var(--asphalt)]/20 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-[var(--asphalt)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-sm border-2 border-[var(--asphalt)] overflow-hidden">
              {["All", "Available", "Booked"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors"
                  style={{
                    background: filter === f ? "var(--asphalt)" : "transparent",
                    color: filter === f ? "white" : "var(--asphalt)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-sm border-2 border-[var(--asphalt)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--asphalt)] hover:bg-[var(--asphalt)] hover:text-white"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </section>

        {/* Slot grid */}
        <section className="mb-9 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {filteredSlots.length ? (
            filteredSlots.map((slot) => (
              <SlotTile
                key={slot.number}
                slot={slot}
                onClick={() => handleSlotClick(slot)}
              />
            ))
          ) : (
            <p className="col-span-full py-6 text-center text-sm text-[var(--asphalt)]/50">
              No slots match your search.
            </p>
          )}
        </section>

        {/* Booking history */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <History size={16} className="text-[var(--asphalt)]/60" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-[var(--asphalt)]/80">
              Booking history
            </h2>
            <span className="rounded-full bg-[var(--asphalt)]/10 px-2 py-0.5 text-[11px] font-bold">
              {history.length}
            </span>
          </div>

          {history.length === 0 ? (
            <p className="rounded-sm border-2 border-dashed border-[var(--asphalt)]/15 px-4 py-5 text-center text-sm text-[var(--asphalt)]/45">
              Cancelled bookings will show up here.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-sm border-2 border-[var(--asphalt)]/15">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[var(--asphalt)]/15 bg-[var(--asphalt)]/5 text-[11px] uppercase tracking-wide text-[var(--asphalt)]/60">
                    <th className="px-3 py-2">Slot</th>
                    <th className="px-3 py-2">Owner</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Cancelled at</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr
                      key={`${h.slotNumber}-${h.cancelledAt}-${i}`}
                      className="border-b border-[var(--asphalt)]/10 last:border-0"
                    >
                      <td className="px-3 py-2 font-mono font-bold">{h.slotNumber}</td>
                      <td className="px-3 py-2">{h.ownerName}</td>
                      <td className="px-3 py-2 font-mono">{h.vehicleNumber}</td>
                      <td className="px-3 py-2 text-[var(--asphalt)]/60">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {h.cancelledAt}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {bookingSlot && (
        <BookingModal
          slot={bookingSlot}
          onClose={() => setBookingSlot(null)}
          onSubmit={handleBook}
        />
      )}
      {detailsSlot && bookings[detailsSlot] && (
        <DetailsModal
          booking={bookings[detailsSlot]}
          onClose={() => setDetailsSlot(null)}
          onCancel={handleCancel}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-sm px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-white shadow-lg"
          style={{ background: "var(--asphalt)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
