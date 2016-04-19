var casper = require('casper').create({
   /* clientScripts:  [
        'includes/jquery.js',      // These two scripts will be injected in remote
        'includes/underscore.js'   // DOM on every request
    ],*/
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: true,         // use these settings
		userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
    },
	viewportSize: {width: 1200, height: 800}
    //logLevel: "info",              // Only "info" level messages will be logged
    //verbose: true                  // log messages will be printed out to the console
});
var opts = casper.cli.options;
var fs = require('fs');
var url='http://www.qualibat.com';
var col_head = 'companyname;address;phone;fax;email;\n';
var valueall =[];
var valuehtml;
var home = 'http://www.qualibat.com/Views/';
var company_name='', address='', phone='', fax='', email='';
var data_file = '';
var readlist = fs.read('list.txt');
var listarray = (readlist.trim()).split('\n');


casper.start(url,function(response){

	if (response == undefined || response.status >= 400){
		this.echo('error page.');
		this.capture('error/error_home.png');
	}else{
		this.capture('home.png');
		require('utils').dump(listarray);
		fs.write('qualibat.csv',col_head,'w');
		loopURL();

	}
});
function loopURL(){
	casper.then(function(){
		this.each(listarray, function(self,link,index){
			self.thenOpen(home+link, function(response){
				if (response == undefined || response.status >= 400){
					this.echo('error page.');
					this.capture('error/error_each_'+index+'.png');
				}else{
					// this.capture('img/link_'+index+'.png');
					// this.echo('next to '+index);
					extractDetail();
				}
			


			});
		});
	});
}
function extractDetail(){
	company_name=''; 
	address=''; 
	phone='';
	fax='';
	email='';
	casper.then(function(){
		this.then(function(){
		data_file = '';
		var tmp_datas = this.getElementsInfo('.recherche_entreprise_detail:nth-of-type(1) > tbody > tr');
			for(var i=0;i<tmp_datas.length;i++){
				var tmp_value = '';
				tmp_value = (tmp_datas[i].html).replace(/\s+/g,' ');
				if(tmp_value.match(/(<th>\s.*?<\/th>\s<td>\s<strong>)(\s+.*?|\s+.*?\s+|.*?)(<\/strong>\s<\/td>)/ig)){
					company_name = (tmp_value.replace(/(<th>\s.*?<\/th>\s<td>\s<strong>)(\s+.*?|\s+.*?\s+|.*?)(<\/strong>\s<\/td>)/ig,'$2')).replace(/\s+|amp;/ig,' ').trim();
				}	
				if(tmp_value.match(/(<th>\sAdresse\s<\/th>\s<td>)(.*?)(<\/td>)/ig)){
					address = (tmp_value.replace(/(<th>\sAdresse\s<\/th>\s<td>)(.*?)(<\/td>)/ig,'$2')).replace(/<br>/,'').trim();
				}
				if(tmp_value.match(/(<th>\sTéléphone\s<\/th>\s<td>)(.*?)(<\/td>)/ig)){
					phone = tmp_value.replace(/(<th>\sTéléphone\s<\/th>\s<td>)(.*?)(<\/td>)/ig,'$2').trim();
				}
				if(tmp_value.match(/(<th>\sFax\s<\/th>\s<td>)(.*?)(<\/td>)/ig)){
					fax = tmp_value.replace(/(<th>\sFax\s<\/th>\s<td>)(.*?)(<\/td>)/ig,'$2').trim();
				}
				if(tmp_value.match(/(<th>E-mail<\/th><td>\s+<a href="(.*?)>)(.*?|.*?\s+)(<\/a><\/td>)/ig)){
					email = tmp_value.replace(/(<th>E-mail<\/th><td>\s+<a href="(.*?)>)(.*?|.*?\s+)(<\/a><\/td>)/ig,'$3').trim();
				}
			}

			
		});
		this.then(function(){
			data_file = company_name+';'+address+';'+phone+';'+fax+';'+email+'\n';
			fs.write('qualibat.csv',data_file,'a');
		});
				
	});
}

casper.run(function(){
	this.echo('completed.');

});