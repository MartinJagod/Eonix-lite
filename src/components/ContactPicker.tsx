import React from 'react';

export type Contact = { id: number; name: string; phone: string };

interface Props {
  contacts: Contact[];
  selected: number[];
  onToggle: (id: number, checked: boolean) => void;
}

export default function ContactPicker({ contacts, selected, onToggle }: Props) {
  return (
    <div className="grid gap-2">
      {contacts.map(c => (
        <label
          key={c.id}
          className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50"
        >
          <input
            type="checkbox"
            className="h-4 w-4 accent-emerald-600"
            checked={selected.includes(c.id)}
            onChange={e => onToggle(c.id, e.target.checked)}
          />
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-gray-500">{c.phone}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
