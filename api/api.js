export default function handler(req, res) {
  // Common API data
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ];

  // Return JSON response
  res.status(200).json({
    success: true,
    data: users
  });
}
