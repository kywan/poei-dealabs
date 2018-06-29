// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
/*$.get("https://www.dealabs.com/rss/tout", function(data){
    $.each(data, function (index, value) {
        if (index === 'documentElement') {
            console.log(value);
            var xml = $(value)
            var title = xml.find("title")
            var cat = xml.find("category")
            var price = xml.getElementsByTagName("pepper:marchant")
            console.log(price)
            for (i = 0; i < title.length -1 ; i++)
            {
                console.log(title[i+1].textContent + " : " + cat[i].textContent)
            }
        }
    });
});*/
if (window.XMLHttpRequest)
{
    xmlhttp=new XMLHttpRequest();
}
else
{
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET","https://www.dealabs.com/rss/tout",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;
console.log(xmlDoc);
var item=xmlDoc.getElementsByTagName("item");
console.log(item[0].childNodes[1].getAttribute('price'));
console.log(item[0]);

var i = 0;
while (item[i]) {
    var title = item[i].childNodes[3].textContent;
    if (title.length > 100) title = title.substring(0,100) + '...';
    var vendeur_price = item[i].childNodes[1].getAttribute('name');
    if (vendeur_price == null)
        vendeur_price = '';
    var price = item[i].childNodes[1].getAttribute('price');
    if (price != null){
        if(vendeur_price != '')
            vendeur_price += ' - ';
        vendeur_price += price;
    }
    var img = item[i].childNodes[2].getAttribute('url');
    if (img == null)
        img = "./img/no-image.png";
    const regex_img = /<img.*>/gm;
    const regex_title = /<strong>.*<\/strong>/gm
    let m;
    var description = item[i].childNodes[4].textContent;
    if (description.length > 500) description = description.substring(0,500) + '...';
    while ((m = regex_img.exec(description)) !== null)
    {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex_img.lastIndex) {
            regex_img.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            description = description.replace(match, '')
        });
    }
    while ((m = regex_title.exec(description)) !== null)
    {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex_title.lastIndex) {
            regex_title.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 0)
                description = description.replace(match, '')
        });
    }

    var link = item[i].childNodes[5].textContent;
    var date = new Date(item[i].childNodes[6].textContent);
    var date_now = new Date()
    var old = parseInt(Math.abs((date_now.getTime() - date.getTime()) / 1000 / 60))

    $('#main').html($('#main').html() + "<div class='card'>" +
        "<img class='card-img-top' src='" + img + "'>" +
        "<div class='card-body'>" +
        "<h5 class='card-title'>"+ title + "</h5>" +
        "<small class='text-muted'>"+ vendeur_price + "</small>" +
        "<p class='card-text'>" + description + "</p>" +
        "</div>" +
        "<div class='card-footer'>" +
        "<small class='text-muted align-middle'>Mis en ligne il y a "+ old +" Minute(s)</small>" +
        "<button type='button' class='btn btn-outline-success' onClick=\"window.open('" + link +"');\">Buy</button>")
    i++
}

