import { useEffect, useState } from "react"
import "./App.css"

const API = "http://127.0.0.1:3000/items"

function App() {
    const [items, setItems] = useState([])
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [editId, setEditId] = useState(null)

    const getItems = async () => {
        const response = await fetch(API)
        setItems(await response.json())
    }

    useEffect(() => {
        getItems()
    }, [])

    const saveItem = async (e) => {
        e.preventDefault()

        if (!name || price === "") {
            alert("Enter name and price")
            return
        }

        await fetch(
            editId ? `${API}/${editId}` : API,
            {
                method: editId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    price: Number(price)
                })
            }
        )

        setName("")
        setPrice("")
        setEditId(null)
        getItems()
    }

    const editItem = (item) => {
        setEditId(item.id)
        setName(item.name)
        setPrice(item.price)
    }

    const deleteItem = async (id) => {
        if (!confirm("Delete this item?")) return

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        })

        getItems()
    }

    return (
        <div className="app">

            <div className="intro">
                <div className="circle">I</div>

                <div>
                    <h1>Items</h1>
                    <p>
                        {items.length} item
                        {items.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <form onSubmit={saveItem}>

                <div className="field">
                    <label>Name</label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item name"
                    />
                </div>

                <div className="field">
                    <label>Price</label>

                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                    />
                </div>

                <button>
                    {editId ? "Save" : "Add"}
                </button>

                {editId && (
                    <button
                        type="button"
                        className="cancel"
                        onClick={() => {
                            setEditId(null)
                            setName("")
                            setPrice("")
                        }}
                    >
                        Cancel
                    </button>
                )}

            </form>

            <section>

                {items.map((item) => (

                    <div className="item" key={item.id}>

                        <div className="number">
                            {item.id}
                        </div>

                        <div className="details">
                            <strong>{item.name}</strong>
                            <small>Product item</small>
                        </div>

                        <div className="price">
                            ₹{item.price}
                        </div>

                        <div className="actions">

                            <button
                                onClick={() => editItem(item)}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteItem(item.id)}
                            >
                                ×
                            </button>

                        </div>

                    </div>

                ))}

                {items.length === 0 && (
                    <div className="empty">
                        Your item list is empty.
                    </div>
                )}

            </section>

        </div>
    )
}

export default App