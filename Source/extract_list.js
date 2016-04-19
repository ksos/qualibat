var casper = require('casper').create({
	javascriptEnabled: false,
	pageSettings: {
		loadImages:  false,        // The WebPage instance used by Casper will
		loadPlugins: false, 	   //Setting Wait time out
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0'	
	},
	verbose: true,
	viewportSize: {width: 1200, height: 800}
});

var fs = require('fs');
var url = 'http://www.qualibat.com/Views/EntreprisesRecherche.aspx';
var com_links = [];
var length_of_click_pagins = [];
var tmp = '';
var start_pagin = '';
fs.write('list.txt','', 'w');

casper.start(url);

casper.then(function(){
	com_links = [];
	if(this.exists('.formulaire_buttons input[type="submit"]')){
		this.click('.formulaire_buttons input[type="submit"]');
		this.waitFor(function check(){
			return (this.exists('#Main_Main_ucRechercheAvancee_ucResultat_upnResultats'))==true;
		}, function then(){
			this.echo('Getting url...');
			this.capture('test.png');
			click_pagins();
		},function timeout(){
			this.echo('No data show....');
			this.capture('Error_page_show.png');
		}, 60000);
	}
	
	// this.then(function(){
	// 	for (var i = 0; i < all_links.length; i++){
	// 		fs.write('list.txt', all_links[i]+'\n', 'a');
	// 	}
	// });
});

casper.run(function(){
	this.echo('Run Completed.');
	this.exit();
});
//
function click_pagins(){
	casper.then(function(){
		get_links();
		this.then(function(){
			if(this.exists('#Main_Main_ucRechercheAvancee_ucResultat_dpEntreprisesTop > span')){
				start_pagin = (this.fetchText('#Main_Main_ucRechercheAvancee_ucResultat_dpEntreprisesTop > span')).trim();
			}
			this.then(function(){
				if(this.exists('#Main_Main_ucRechercheAvancee_ucResultat_dpEntreprisesTop > span+a')){
					this.click('#Main_Main_ucRechercheAvancee_ucResultat_dpEntreprisesTop > span+a');
					this.waitFor(function check(){
						return (start_pagin != (this.fetchText('#Main_Main_ucRechercheAvancee_ucResultat_dpEntreprisesTop > span')).trim()) == true;
					}, function then(){
						this.echo('go to next pagination...');
						this.capture('test.png');
						click_pagins();
					}, function timeout(){
						this.echo('click timeout with page ' + start_pagin);
					}, 60000);
				}
			});
		});
	});
}

function get_links(){
	// list of company
	casper.then(function(){
		if(this.exists('ul[style="list-style-type: none;"] li p a:last-child')){
			com_links = this.getElementsAttribute('ul[style="list-style-type: none;"] li p a:last-child', 'href');
		}
		this.then(function(){
			this.then(function(){
				for (var i = 0; i < com_links.length; i++){
					fs.write('list.txt', com_links[i]+'\n', 'a');
				}
			});
		});
	});
}


// link of each company
// ul[style="list-style-type: none;"] li p a:last-child

// selector of paginations at the top
// #Main_Main_ucRechercheAvancee_ucResultat_dpEntreprisesTop a

