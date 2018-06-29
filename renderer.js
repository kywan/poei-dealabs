//
// Ici on lance simplement le processus pour collecter le RSS
//
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

//
// on récupère sous la forme d'un tableau la liste des "item"
//
var item=xmlDoc.getElementsByTagName("item");

//
// Boucle principale
// S'arrète quand il n'y a plus d'item a traiter
//
var i = 0;
while (item[i]) {
    //
    // Boucle secondaire
    // Cette boucle permet d'etre sure des données que nous recevons
    // S'arrète quand il n'y as plus de childNodes à traiter
    //
    let j = 0;
    while (item[i].childNodes[j]) {
        //
        // Gestion du titre
        // Si il fait plus de 100 chars on le coupe et ajoute '...' a la fin
        //
        if (item[i].childNodes[j].localName == 'title') {
            var title = item[i].childNodes[j].textContent;
            if (title.length > 100) title = title.substring(0, 100) + '...';
        }
        //
        // Gestion du merchant : Vendeur et prix
        // Affichage du style : Vendeur - prix
        //
        else if (item[i].childNodes[j].localName == 'merchant') {
            var vendeur_price = item[i].childNodes[j].getAttribute('name');
            if (vendeur_price == null)
                vendeur_price = '';
            var price = item[i].childNodes[j].getAttribute('price');
            if (price != null) {
                if (vendeur_price != '')
                    vendeur_price += ' - ';
                vendeur_price += price;
            }
        }
        //
        // Gestion du contenue
        // Permet de récuperer l'image, ajout d'une image par défault si image non fournis
        //
        else if (item[i].childNodes[j].localName == 'content') {
            var img = item[i].childNodes[j].getAttribute('url');
            if (img == '')
                img = "./img/no-image.png";
        }
        //
        // Gestion de la Description
        // On retire toute les images et le 'titre' du texte
        // Si il fait plus de 500 chars on le coupe et ajoute '...' a la fin
        //
        else if (item[i].childNodes[j].localName == 'description') {
            const regex_img = /<img.*>/gm;
            const regex_title = /<strong>.*<\/strong>/gm
            let m;
            var description = item[i].childNodes[j].textContent;
            while ((m = regex_img.exec(description)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex_img.lastIndex) {
                    regex_img.lastIndex++;
                }
                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    description = description.replace(match, '')
                });
            }
            while ((m = regex_title.exec(description)) !== null) {
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
            if (description.length > 500){ description = description.substring(0, 500) + '...';}
        }
        //
        // Gestion du lien d'achat
        //
        else if (item[i].childNodes[j].localName == 'link') {
            var link = item[i].childNodes[j].textContent;
        }
        //
        // Gestion de la date de publication
        // On calcul l'ecrart entre la publication est now
        //
        else if (item[i].childNodes[j].localName == 'pubDate') {
            var date = new Date(item[i].childNodes[j].textContent);
            var date_now = new Date()
            var old = parseInt(Math.abs((date_now.getTime() - date.getTime()) / 1000 / 60))
        }
        j++;
    }

    $('#main').html($('#main').html() + "<div class='card'>" +
        "<img class='card-img-top p-2' src='" + img + "'>" +
        "<div class='card-body'>" +
        "<h5 class='card-title'>"+ title + "</h5>" +
        "<small class='text-muted'>"+ vendeur_price + "</small>" +
        "<p class='card-text'>" + description + "</p>" +
        "</div>" +
        "<div class='card-footer'>" +
        "<small class='text-muted align-middle'>Mis en ligne il y a "+ old +" Minute(s)</small>" +
        "<button type='button' class='btn btn-outline-success' onClick=\"window.open('" + link +"');\">Buy</button>")+
        "</div></div>"
    i++
}

