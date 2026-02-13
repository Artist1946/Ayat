const items = [

{category:"wudu", title:"السواك",
 text:"قال ﷺ: لولا أن أشق على أمتي لأمرتهم بالسواك عند كل وضوء.",
 reference:"رواه البخاري ومسلم"},

{category:"wudu", title:"غسل الكفين ثلاثًا",
 text:"كان يغسل كفيه ثلاثًا قبل إدخالهما الإناء.",
 reference:"رواه أبو داود"},

{category:"wudu", title:"المضمضة والاستنشاق",
 text:"كان يتمضمض ويستنشق ثلاثًا.",
 reference:"رواه مسلم"},

{category:"wudu", title:"البدء باليمين",
 text:"كان يحب التيامن في طهوره.",
 reference:"رواه البخاري"},

{category:"salah", title:"رفع اليدين عند التكبير",
 text:"كان يرفع يديه عند تكبيرة الإحرام.",
 reference:"رواه البخاري ومسلم"},

{category:"salah", title:"دعاء الاستفتاح",
 text:"سبحانك اللهم وبحمدك...",
 reference:"رواه أبو داود"},

{category:"salah", title:"قول آمين",
 text:"إذا قال الإمام ولا الضالين فقولوا آمين.",
 reference:"رواه البخاري"},

{category:"salah", title:"الدعاء في السجود",
 text:"أقرب ما يكون العبد من ربه وهو ساجد.",
 reference:"رواه مسلم"}

];

const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");

function render(data){
container.innerHTML="";
data.forEach((item,index)=>{
container.innerHTML += `
<div class="card">
<div class="category">${item.category === "wudu" ? "سنن الوضوء" : "سنن الصلاة"}</div>
<div class="title">${item.title}</div>
<div>${item.text}</div>
<button class="button" onclick="toggleDetails(${index})">المصدر</button>
<div class="details" id="details${index}">${item.reference}</div>
</div>
`;
});
}

function toggleDetails(index){
const element = document.getElementById("details"+index);
element.style.display = element.style.display === "block" ? "none" : "block";
}

function filterItems(type){
document.querySelectorAll(".tab").forEach(tab=>tab.classList.remove("active"));
event.target.classList.add("active");

if(type === "all"){
render(items);
}else{
render(items.filter(item=>item.category === type));
}
}

searchInput.addEventListener("input",()=>{
const value = searchInput.value;
render(items.filter(item =>
item.title.includes(value) || item.text.includes(value)
));
});

render(items);
