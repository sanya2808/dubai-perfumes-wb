import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Dubai Perfumes Backend Running 🚀");
});

/* PRODUCTS API */
app.get("/api/products", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Oud Royal",
            price: 1200
        },
        {
            id: 2,
            name: "Amber Musk",
            price: 900
        },
        {
            id: 3,
            name: "Arabian Night",
            price: 1500
        }
    ]);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});