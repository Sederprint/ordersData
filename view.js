import { db } from "./config.js";
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Function to get the order ID from the URL
function getOrderIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Function to display order data
async function displayOrderData(orderId) {
  if (orderId) {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      loadDataIntoTabs(data);
    } else {
      document.getElementById("orderDataAll").innerText = "No such document!";
      document.getElementById("orderDataPrint").innerText = "";
      document.getElementById("orderDataFinishing").innerText = "";
    }
  } else {
    document.getElementById("orderDataAll").innerText = "No order ID provided";
    document.getElementById("orderDataPrint").innerText = "";
    document.getElementById("orderDataFinishing").innerText = "";
  }
}

// Add event listener for search button
document.getElementById("searchOrderButton").addEventListener("click", () => {
  const orderNumber = document.getElementById("orderIdInput").value;
  searchOrderByNumber(orderNumber);
});

async function searchOrderByNumber(orderNumber) {
  if (orderNumber) {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("orderId", "==", orderNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadDataIntoTabs(data);
      });
    } else {
      document.getElementById("orderDataAll").innerText = "No such document!";
      document.getElementById("orderDataPrint").innerText = "";
      document.getElementById("orderDataFinishing").innerText = "";
    }
  } else {
    document.getElementById("orderDataAll").innerText =
      "Please enter an order number.";
    document.getElementById("orderDataPrint").innerText = "";
    document.getElementById("orderDataFinishing").innerText = "";
  }
}

function loadDataIntoTabs(data) {
  // --- Set Main Title ---
  document.getElementById("customerName").textContent = data.customerName;
  document.getElementById("orderId").textContent = data.orderId;

  // ---  Order Details Tab (All Data)  ---
  document.getElementById("orderDataAll").innerHTML = `
      <h2>פרטי הזמנה</h2>
      <p><strong>מספר הזמנה:</strong> ${data.orderId}</p>
      <p><strong>שם משתמש:</strong> ${data.userName}</p>
      <p><strong>שם לקוח:</strong> ${data.customerName}</p>
      <p><strong>שם מוצר:</strong> ${data.productName}</p>
      <p><strong>מלאי:</strong> ${data.stock}</p>
      <p><strong>תאריך הגשה:</strong> ${data.submissionDate}</p>
      <p><strong>רוחב (מ"מ):</strong> ${data.width}</p>
      <p><strong>גובה (מ"מ):</strong> ${data.height}</p>
      <p><strong>כמות:</strong> ${data.quantity}</p>
      <p><strong>חומר:</strong> ${data.material}</p>
      <p><strong>הדפסה פנימית:</strong> ${data.internalPrint}</p>
      <p><strong>מדפסת:</strong> ${data.printer}</p>
      <p><strong>סוג כריכה:</strong> ${data.coverType}</p>
      <p><strong>למינציה של הכריכה:</strong> ${data.laminationOfCover}</p>
      <p><strong>סוג כריכה:</strong> ${data.bindingType}</p>
      <p><strong>הערות:</strong> ${data.comments}</p>
      <p><strong>חיתוך:</strong> ${
        data.cutting ? data.cutting.join(", ") : ""
      }</p>
      <p><strong>ציפוי:</strong> ${
        data.coating ? data.coating.join(", ") : ""
      }</p>
      <p><strong>קיפול:</strong> ${
        data.folding ? data.folding.join(", ") : ""
      }</p>
      <p><strong>גימורים שונים:</strong> ${
        data.variousFinishing ? data.variousFinishing.join(", ") : ""
      }</p>
      <p><strong>מספר ניקובים:</strong> ${data.numberOfPerforation}</p>
      <p><strong>מספר קיפולים:</strong> ${data.numberOfCreasing}</p>
      <p><strong>מספר קיפולים:</strong> ${data.numberOfFolding}</p>
    `;

  // ---  Printing Information Tab  ---
  document.getElementById("orderDataPrint").innerHTML = `
      <h2>מידע לדפס</h2>
      <p><strong>שם מוצר:</strong> ${data.productName}</p>
      <p><strong>חומר:</strong> ${data.material}</p>
      <p><strong>הדפסה פנימית:</strong> ${data.internalPrint}</p>
      <p><strong>מדפסת:</strong> ${data.printer}</p>
      <p><strong>רוחב (מ"מ):</strong> ${data.width}</p>
      <p><strong>גובה (מ"מ):</strong> ${data.height}</p>
      <p><strong>כמות:</strong> ${data.quantity}</p>
    `;

  // ---  Finishing Information Tab  ---
  document.getElementById("orderDataFinishing").innerHTML = `
      <h2>מידע לגימורים</h2>
      <p><strong>סוג כריכה:</strong> ${data.coverType}</p>
      <p><strong>למינציה של הכריכה:</strong> ${data.laminationOfCover}</p>
      <p><strong>סוג כריכה:</strong> ${data.bindingType}</p>
      <p><strong>חיתוך:</strong> ${
        data.cutting ? data.cutting.join(", ") : ""
      }</p>
      <p><strong>ציפוי:</strong> ${
        data.coating ? data.coating.join(", ") : ""
      }</p>
      <p><strong>קיפול:</strong> ${
        data.folding ? data.folding.join(", ") : ""
      }</p>
      <p><strong>גימורים שונים:</strong> ${
        data.variousFinishing ? data.variousFinishing.join(", ") : ""
      }</p>
      <p><strong>מספר ניקובים:</strong> ${data.numberOfPerforation}</p>
      <p><strong>מספר קיפולים:</strong> ${data.numberOfCreasing}</p>
      <p><strong>מספר קיפולים:</strong> ${data.numberOfFolding}</p> 
    `;
}

// Get the order ID from URL and display the data if present
const orderIdFromURL = getOrderIdFromURL();
if (orderIdFromURL) {
  displayOrderData(orderIdFromURL);
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
window.openTab = openTab;

// Set default tab to be open
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".tablinks").click();
});
