function ResumeForm({ data, setData }) {
  return (
    <div className="space-y-3">

      <input
        className="w-full p-2 rounded bg-gray-800 text-white"
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <input
        className="w-full p-2 rounded bg-gray-800 text-white"
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <textarea
        className="w-full p-2 rounded bg-gray-800 text-white"
        placeholder="Summary"
        value={data.summary}
        onChange={(e) => setData({ ...data, summary: e.target.value })}
      />

      <input
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        placeholder="Skills (react, css, node)"
        value={data.skills}
        onChange={(e) => setData({ ...data, skills: e.target.value })}
      />

    </div>
  );
}

export default ResumeForm;