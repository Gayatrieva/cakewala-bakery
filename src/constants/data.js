// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
// All static/mock data: categories, cakes, testimonials, admin data, chart data

export const CATEGORIES = [
  { id: "birthday",    label: "Birthday Cakes",    emoji: "🎂", color: "#FFD6E7", img: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=300&q=80" },
  { id: "wedding",     label: "Wedding Cakes",     emoji: "💍", color: "#E8D5F5", img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&q=80" },
  { id: "anniversary", label: "Anniversary",       emoji: "💑", color: "#FFE4D6", img: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&q=80" },
  { id: "photo",       label: "Photo Cakes",       emoji: "📷", color: "#D6F5E8", img: "https://images.unsplash.com/photo-1562440499-64b9a5a35975?w=300&q=80" },
  { id: "cupcake",     label: "Cupcakes",          emoji: "🧁", color: "#FFF3D6", img: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=300&q=80" },
  { id: "custom",      label: "Custom Cakes",      emoji: "✨", color: "#D6E8FF", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&q=80" },
];

export const CAKES = [
  { id:1,  name:"Strawberry Dream",       category:"birthday",    price:799,  img:"https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&q=80", rating:4.9, reviews:142, badge:"bestseller", flavors:["Vanilla","Strawberry","Butterscotch"], weights:[{w:"0.5kg",p:799},{w:"1kg",p:1299},{w:"2kg",p:2299}], desc:"A dreamy three-layer vanilla sponge filled with fresh strawberry compote and whipped cream, crowned with glazed strawberries." },
  { id:2,  name:"Chocolate Truffle",      category:"birthday",    price:899,  img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", rating:5.0, reviews:218, badge:"bestseller", flavors:["Dark Chocolate","Milk Chocolate","Hazelnut"], weights:[{w:"0.5kg",p:899},{w:"1kg",p:1499},{w:"2kg",p:2699}], desc:"Rich, decadent dark chocolate ganache cake with truffle filling and a mirror-glaze finish." },
  { id:3,  name:"White Elegance",         category:"wedding",     price:3499, img:"https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80", rating:4.8, reviews:76,  badge:"featured",    flavors:["Vanilla","Rose","Lemon"], weights:[{w:"2kg",p:3499},{w:"3kg",p:4999},{w:"5kg",p:7999}], desc:"A four-tier masterpiece adorned with hand-crafted sugar flowers and edible gold leaf — the centrepiece your wedding deserves." },
  { id:4,  name:"Rose Garden Delight",    category:"anniversary", price:1299, img:"https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80", rating:4.7, reviews:94,  badge:"new",         flavors:["Rose","Lychee","Raspberry"], weights:[{w:"0.5kg",p:1299},{w:"1kg",p:1999},{w:"2kg",p:3499}], desc:"Inspired by a blooming garden — rose-infused cream, lychee compote, and hand-piped buttercream petals." },
  { id:5,  name:"Red Velvet Romance",     category:"anniversary", price:999,  img:"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80", rating:4.8, reviews:109, badge:"bestseller",  flavors:["Red Velvet","Cream Cheese","Vanilla"], weights:[{w:"0.5kg",p:999},{w:"1kg",p:1599},{w:"2kg",p:2899}], desc:"Velvety crimson sponge with cream cheese frosting, finished with delicate edible rose petals." },
  { id:6,  name:"Rainbow Celebration",    category:"birthday",    price:849,  img:"https://images.unsplash.com/photo-1562440499-64b9a5a35975?w=600&q=80", rating:4.6, reviews:83,  badge:"",            flavors:["Vanilla","Funfetti","Cotton Candy"], weights:[{w:"0.5kg",p:849},{w:"1kg",p:1399},{w:"2kg",p:2499}], desc:"Six vibrant rainbow layers with fluffy cloud frosting and rainbow sprinkles — pure joy in every slice." },
  { id:7,  name:"Blush Cupcake Box",      category:"cupcake",     price:599,  img:"https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&q=80", rating:4.9, reviews:201, badge:"bestseller",  flavors:["Vanilla","Strawberry","Chocolate"], weights:[{w:"6 pcs",p:599},{w:"12 pcs",p:1099},{w:"24 pcs",p:1999}], desc:"Hand-decorated blush pink cupcakes with swirled buttercream and edible glitter — each one a little work of art." },
  { id:8,  name:"Memory Lane Photo Cake", category:"photo",       price:1199, img:"https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=600&q=80", rating:4.7, reviews:67,  badge:"",            flavors:["Vanilla","Chocolate","Pineapple"], weights:[{w:"0.5kg",p:1199},{w:"1kg",p:1699},{w:"2kg",p:2999}], desc:"Cherish memories with an edible photo print on velvety cream frosting. Simply share your photo, we'll do the rest." },
  { id:9,  name:"Designer Fantasy",       category:"custom",      price:1999, img:"https://images.unsplash.com/photo-1488477304112-4944851de03d?w=600&q=80", rating:5.0, reviews:38,  badge:"featured",    flavors:["Chocolate","Vanilla","Caramel"], weights:[{w:"1kg",p:1999},{w:"2kg",p:3499},{w:"3kg",p:4999}], desc:"A completely bespoke creation — you dream it, our artists craft it. Intricate fondant work, hand-painted details, sculptural elements." },
  { id:10, name:"Golden Lemon Drizzle",   category:"anniversary", price:799,  img:"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80", rating:4.5, reviews:52,  badge:"new",         flavors:["Lemon","Elderflower","Vanilla"], weights:[{w:"0.5kg",p:799},{w:"1kg",p:1299},{w:"2kg",p:2299}], desc:"Zesty lemon sponge drizzled with golden syrup, frosted with silky lemon curd cream and crystallised lemon zest." },
];

export const TESTIMONIALS = [
  { id:1, name:"Priya Sharma",    city:"Mumbai",    rating:5, text:"The Strawberry Dream for my daughter's birthday was absolutely stunning! Everyone at the party kept asking where I got it. The flavour was out of this world 🎂", avatar:"PS", date:"2 weeks ago" },
  { id:2, name:"Arjun Mehta",     city:"Delhi",     rating:5, text:"Ordered the White Elegance for our wedding. It was beyond our expectations — the sugar flowers looked real! Sweet Delights made our day even more special.", avatar:"AM", date:"1 month ago" },
  { id:3, name:"Sneha Kapoor",    city:"Bangalore", rating:5, text:"The custom designer cake for my husband's 40th was a masterpiece. They replicated his favourite cricket ground in fondant. Unbelievable attention to detail!", avatar:"SK", date:"3 weeks ago" },
  { id:4, name:"Ravi Krishnan",   city:"Chennai",   rating:5, text:"Placed my order via WhatsApp at 9pm and the cake arrived fresh the next morning. Red Velvet Romance tasted even better than it looked!", avatar:"RK", date:"5 days ago" },
  { id:5, name:"Meera Nair",      city:"Kochi",     rating:5, text:"The cupcake box was the hit of our office party. 24 perfectly decorated cupcakes, all different toppings. Truly premium quality at a great price.", avatar:"MN", date:"1 week ago" },
  { id:6, name:"Divya Pillai",    city:"Pune",      rating:5, text:"Memory Lane Photo Cake was the most emotional gift I've ever given to my parents on their anniversary. The photo print was crystal clear and so beautiful!", avatar:"DP", date:"2 weeks ago" },
];

export const ADMIN_ORDERS = [
  { id:"SD8472931", customer:"Priya Sharma",  phone:"9876543210", cake:"Strawberry Dream 1kg", total:1299, date:"2025-01-15", delivery:"2025-01-17 10–12pm", status:"delivered",        payment:"COD" },
  { id:"SD8472930", customer:"Arjun Mehta",   phone:"9876543211", cake:"Chocolate Truffle 2kg",total:2699, date:"2025-01-15", delivery:"2025-01-18 2–4pm",  status:"preparing",        payment:"Online" },
  { id:"SD8472929", customer:"Sneha Kapoor",  phone:"9876543212", cake:"Designer Fantasy 3kg", total:4999, date:"2025-01-14", delivery:"2025-01-20 10–12pm", status:"accepted",         payment:"Online" },
  { id:"SD8472928", customer:"Ravi Krishnan", phone:"9876543213", cake:"Red Velvet 1kg",       total:1599, date:"2025-01-14", delivery:"2025-01-15 4–6pm",  status:"out_for_delivery", payment:"COD" },
  { id:"SD8472927", customer:"Meera Nair",    phone:"9876543214", cake:"Cupcake Box 24pcs",    total:1999, date:"2025-01-13", delivery:"2025-01-16 10–12pm", status:"pending",          payment:"Online" },
  { id:"SD8472926", customer:"Divya Pillai",  phone:"9876543215", cake:"Photo Cake 1kg",       total:1699, date:"2025-01-12", delivery:"2025-01-14 2–4pm",  status:"delivered",        payment:"Online" },
  { id:"SD8472925", customer:"Kiran Rao",     phone:"9876543216", cake:"White Elegance 3kg",   total:4999, date:"2025-01-12", delivery:"2025-01-19 10–12pm", status:"preparing",        payment:"Online" },
  { id:"SD8472924", customer:"Anjali Singh",  phone:"9876543217", cake:"Rainbow 1kg",          total:1399, date:"2025-01-11", delivery:"2025-01-13 4–6pm",  status:"delivered",        payment:"COD" },
];

export const ADMIN_CUSTOMERS = [
  { id:1, name:"Priya Sharma",   email:"priya@email.com",  phone:"9876543210", city:"Mumbai",    orders:5, spent:6247,  joined:"Jan 2025" },
  { id:2, name:"Arjun Mehta",    email:"arjun@email.com",  phone:"9876543211", city:"Delhi",     orders:3, spent:8998,  joined:"Dec 2024" },
  { id:3, name:"Sneha Kapoor",   email:"sneha@email.com",  phone:"9876543212", city:"Bangalore", orders:7, spent:11247, joined:"Nov 2024" },
  { id:4, name:"Ravi Krishnan",  email:"ravi@email.com",   phone:"9876543213", city:"Chennai",   orders:2, spent:3298,  joined:"Jan 2025" },
  { id:5, name:"Meera Nair",     email:"meera@email.com",  phone:"9876543214", city:"Kochi",     orders:4, spent:5596,  joined:"Dec 2024" },
  { id:6, name:"Divya Pillai",   email:"divya@email.com",  phone:"9876543215", city:"Pune",      orders:6, spent:9147,  joined:"Oct 2024" },
];

export const SALES_DATA = [
  { day:"Mon", orders:8,  revenue:9420  },
  { day:"Tue", orders:14, revenue:18650 },
  { day:"Wed", orders:11, revenue:14200 },
  { day:"Thu", orders:19, revenue:26800 },
  { day:"Fri", orders:23, revenue:32100 },
  { day:"Sat", orders:31, revenue:44500 },
  { day:"Sun", orders:28, revenue:39800 },
];

export const PIE_DATA = [
  { name:"Birthday",    value:38, color:"#C0395C" },
  { name:"Wedding",     value:22, color:"#E8698A" },
  { name:"Anniversary", value:18, color:"#C4945A" },
  { name:"Custom",      value:12, color:"#9B59B6" },
  { name:"Cupcakes",    value:10, color:"#F59E0B" },
];
