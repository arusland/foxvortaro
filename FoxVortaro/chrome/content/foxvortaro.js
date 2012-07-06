var foxvortaro = function () {
	return {
		init : function () {
			this.maksKvanto = 50;
			
			this.funcs = 
				{ 1 : this.foriguakuzativon,
                  2 : this.foriguplurajn,
                  3 : this.forigutempojn};
                  
            this.prefiksoj =  {
            	1 : "mal",
            	2 : "ge",
            	3 : "ne",
            	4 : "en",
            	5 : "ek",
            	6 : "re",
            	7 : "dis",
            	8 : "bo",
            	9 : "eks",
            	10 : "pra",
            	11 : "fi",
            	12 : "mis"};
                  
            this.sufiksoj = { 
            	1 : "ig",
            	2 : "igx",
            	3 : "in",
            	4 : "it",
            	5 : "at",
            	6 : "ot",
            	7 : "int",
            	8 : "ant",
            	9 : "ont",
            	10 : "et",
            	11 : "eg",
            	12 : "em",
            	13 : "ajx",
            	14 : "ist",
            	15 : "ul",
            	16 : "ec",
            	17 : "ar",
            	18 : "an",
            	19 : "ad",
            	20 : "acx",
            	21 : "ebl",
            	22 : "ej",
            	23 : "il",
            	25 : "uj",
            	26 : "er",
            	27 : "ing",
            	28 : "ind",
            	29 : "end",
            	30 : "id",
            	31 : "ism",
            	32 : "obl",
            	33 : "on",
            	34 : "op",
            	35 : "estr",
            	36 : "um"};
            	
            	jQuery.noConflict();
			    $ = function(selector,context) { 
			        return new jQuery.fn.init(selector,context||content.document); 
			    };
			    $.fn = $.prototype = jQuery.fn;
			},
						
		run : function () {
			this.run_vorto('');
		},
		
		run_vorto : function (vorto) {
			var teksto = vorto != '' ? vorto : this.normaligu(this.elektita_teksto());
			
			if (teksto.length != 0){
				var tradukita = this.traduku_vortoj(teksto);
				
				if (tradukita != null){
					this.montrupanelon(tradukita);
				}else {
					this.montrueraron(teksto);
				}
			}
		},
			
		htmligi : function (obj) {
			var html = $('<div>').append(obj.clone()).remove().html();
			return html;
		},
			
		montrupanelon : function (teksto, eraro) {
			var fenestro = window.openDialog("", "EORU_Vortaro", 'chrome,centerscreen,width=500,height=150,scrollbars=yes,resizable=yes');
			var title = $('<title>').append('Eo-Ru Vortaro');
			var csslink = $('<link>').attr('rel', 'stylesheet')
										  .attr('type', 'text/css')
										  .attr('href', 'chrome://foxvortaro/skin/skin.css');
			var body1 = $('<body>').append(teksto);
			if (eraro) body1.attr('bgcolor', '#EA5744');
			
			var cnt =  $('<html>').append($('<head>').append(title).append(csslink)).append(body1);
			var html = this.htmligi(cnt);
			
			fenestro.document.write(html);
			fenestro.document.close();
			fenestro.focus();
		},
			
		montrueraron : function (vorto) {
			this.montrupanelon("Vorto " + this.htmligu(vorto) + " ne trovita!", true);
		},
			
		traduku_vortoj : function (teksto1) {
			var teksto = teksto1.replace(/[^\w\d]+/g, " ").replace(/\s\s+/gi, " ");
			var vortoj = teksto.split(" ");
			
			vortoj2 = new Array();
			
			// forigu duplikatoj
			for(var i = 0;i < vortoj.length;i++){
				var vrt = this.trim(vortoj[i]).toLowerCase();
				
				if (vrt != '' && vortoj2.indexOf(vrt) < 0){
					vortoj2.push(vrt);
				}
				
				if (vortoj2.length >= this.maksKvanto){
					break;
				}
			}
			
			var tabelo = $('<table>').attr('class', 'spec');
			
			if (vortoj2.length > 0){
				for(var i = 0;i < vortoj2.length;i++){
					var vorto = vortoj2[i];
					var rez = this.traduku(vorto);
						
					if (rez != null)
						tabelo.append(this.tabeligi(rez.v, rez.t));
					else
						tabelo.append(this.tabeligi(vorto, null));
				}
			}else{
				tabelo.append(this.tabeligi(teksto1, null));
			}
			
			var html = this.htmligi(tabelo);
				
			return html;
		},
			
		tabeligi : function(col1, col2){
			var ttr = $('<tr>').append($('<td>').append($('<b>').append(this.htmligu(col1))));
			
			if (col2 == null)
				ttr.append($('<td>').append($('<b>').append($('<div>').attr('style', 'color:red').append('Vorto estas ne trovita!'))));
			else
				ttr.append($('<td>').append($('<b>').append(this.htmligu(col2))));
			
			return ttr;
		},
			
		traduku : function (teksto) {
			
			if (teksto == null || teksto.length <= 0) return null;
			
			var result = this.trovu(teksto);
			if (result != null) return result;
			
			result = this.trovuradikon(teksto);
			if (result != null) return result;
			
			for(var func in this.funcs){
				var teksto2 = this.funcs[func](teksto);
				
				if (teksto != teksto2){
					result = this.trovu(teksto2);
					if (result != null) return result;
					teksto = teksto2;
					result = this.trovuradikon(teksto);
					if (result != null) return result;
				}
			}
			
			if (this.havifinajxon(teksto)){
				teksto3 = teksto.substr(0, teksto.length - 1);
				result = this.trovuradikon(teksto3);
				if (result != null) return result;
			}
			
			result = this.trovualianformon(teksto);
			if (result != null) return result;
			
			return null;
		},
			
		trovupersufiksoj : function (teksto) {
			
			result = this.trovuradikon(teksto);
			if (result != null) return result;
			
			// forigi cxiujn prefiksojn
			do{
				var trovita = false;
				
				for(var suf in this.sufiksoj){
					var sufiks = this.sufiksoj[suf];
					var idx = teksto.lastIndexOf(sufiks);
					
					if (idx > 0 && idx == (teksto.length - sufiks.length)){
						teksto = teksto.substr(0, teksto.length - sufiks.length);
						trovita = true;
						break;
					}
				}
				
				var finu = true;
				
				if (trovita){
					result = this.trovuradikon(teksto);
					if (result != null) return result;
					finu = false;
				}
			}while(!finu);
			
			return null;
		},
		
		trovualianformon : function (teksto) {
			teksto = teksto.toLowerCase();
			var rezultoj = new Array();
			
			if (this.havifinajxon(teksto)){
				teksto = teksto.substr(0, teksto.length - 1);
			}
			
			var result = this.trovupersufiksoj(teksto);
			if (result != null){
				rezultoj.push(result);
			}
			
			do{
				var trovita = false;
				
				for(var pref in this.prefiksoj){
					var prefiks = this.prefiksoj[pref];
					var idx = teksto.indexOf(prefiks);
					
					if (idx == 0){
						teksto = teksto.substr(prefiks.length);
						trovita = true;
						break;
					}
				}
				
				if (trovita){
					var result = this.trovupersufiksoj(teksto);
					if (result != null){
						rezultoj.push(result);
						break;
					}
				}
			}while(trovita);
			
			if (rezultoj.length > 0){
				var bonarez = rezultoj[0];
				
				for(var i = 1;i < rezultoj.length;i++){
					if (bonarez.v.length < rezultoj[i].v.length){
						bonarez = rezultoj[i];
					}
				}
				
				return bonarez;
			}
			
			return null;
		},
			
		trovu : function (teksto) {
			var result = '';
			var index = 0;
			var vortorezulto = '';			
			
			teksto = teksto.toLowerCase();
			
			for(var vorto in this.vortoj){
				
				var linio = this.vortoj[vorto];
				
				if (teksto == linio.v.toLowerCase()){
					if (vortorezulto == '') vortorezulto = linio.v;
					
					if (result == ''){
						result = this.trim(linio.t);
						index = 1;	
					} else if (index == 1){
						result = "1. " + result + "\n2. " + this.trim(linio.t);
						index = 2;
					} else {
						result += "\n" + ++index + ". " + this.trim(linio.t);
					}									
				}
			}
			
			if (result != ''){
				return { "v": vortorezulto, "t": result};
			}else
				return null;
		},
			
		trovuradikon : function (radiko) {
			var index = 0;
			
			radiko = radiko.toLowerCase();
			
			for(var vorto in this.vortoj){
				var linio = this.vortoj[vorto];
				
				if (radiko.length < linio.v.length && radiko == linio.v.substr(0, linio.v.length - 1).toLowerCase()){
					return this.trovu(linio.v);
				}
			}
			
			return null;
		},
			
		htmligu : function(teksto){
			var rezulto = teksto.replace(/(Cx|CX)/g, "Ĉ").replace(/cx/gi, "ĉ").replace(/(Gx|GX)/g, "Ĝ").replace(/gx/gi, "ĝ")
				.replace(/(Hx|HX)/g, "Ĥ").replace(/hx/gi, "ĥ").replace(/(Jx|JX)/g, "Ĵ").replace(/jx/gi, "ĵ")
				.replace(/(Ux|UX)/g, "Ŭ").replace(/ux/gi, "ŭ").replace(/(Sx|SX)/g, "Ŝ").replace(/sx/gi, "ŝ")
				.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
				.replace(/_([^_]+)_/gi, "<span style='color: #6F716F'><i>$1</i></span>");
			return rezulto;
		},
						
		normaligu: function (str)
		{
			return this.trim(str.replace(/ĉ/gi, "cx").replace(/ĝ/gi, "gx").replace(/ŝ/gi, "sx")
			.replace(/ĥ/gi, "hx").replace(/ĵ/gi, "jx").replace(/ŭ/gi, "ux"));
		},
			
		foriguakuzativon: function (str)
		{
			return str.replace(/(on)$/gi, "o").replace(/(an)$/gi, "a").replace(/(en)$/gi, "e")
			.replace(/(jn)$/gi, "j");
		},
			
		foriguplurajn: function (str)
		{
			return str.replace(/(aj)$/gi, "a").replace(/(oj)$/gi, "o");
		},
			
		forigutempojn: function (str)
		{
			return str.replace(/(as|os|is|us|u)$/gi, "i");
		},
			
		havifinajxon: function (str)
		{
			return str.match(/(e|o|i|a)$/gi) != null;
		},
	
		trim: function (str)
		{
			return str.replace(/(^[\s\.\,\-\'\–\:\!\—]+)|([\s\.\,\-\'\–\:\!\—]+$)/g, "");
		},

		// elprenita el http://traduku.net/ 
		elektita_teksto: function(redakte)
		{
			var trad_cel;

			try
			{
				var focusedWindow = document.commandDispatcher.focusedWindow;
				var elektita;
				try
				{
					elektita = focusedWindow.getSelection(); // por FF >= 1.0.3
				}
				catch (e)
				{
					elektita = focusedWindow.__proto__.getSelection.call(focusedWindow); // por FF < 1.0.3
				}

				if (String(elektita).length)
				{
					return String(elektita);
				}

				try
				{
					var tajpejo = document.commandDispatcher.focusedElement;
					if (tajpejo)
					{
						teksto = tajpejo.value;
						if (teksto.length)
						{
							teksto = teksto.substring(tajpejo.selectionStart, tajpejo.selectionEnd);
							return String(teksto);
						}
					}
				}
				catch (e)
				{
				}

				try
				{
					// malsukcesos se oni indikas al nenio au al simpla senelementa teksto
					trad_cel = document.commandDispatcher.focusedElement; 
				
					while (trad_cel && trad_cel.nodeName != "#text")
					{
						if (trad_cel.nodeName.toLowerCase() == "img")
						{
							var img_alt = trad_cel.getAttribute("alt");
							return String(img_alt);
						}
						else
						{
							trad_cel = trad_cel.firstChild;
						}
					}
				}
				catch (e)
				{
				}

				return "";
			}
			catch (e)
			{
				alert("Ne povus elekti tekston.");
				return "";
			}
	}
	};
}();
window.addEventListener("load", foxvortaro.init, false);