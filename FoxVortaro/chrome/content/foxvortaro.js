var foxvortaro = function () {
	return {
		init : function () {
			foxvortaro.maksKvanto = 50;
			
			foxvortaro.funcs = 
				{ 1 : foxvortaro.foriguakuzativon,
                  2 : foxvortaro.foriguplurajn,
                  3 : foxvortaro.forigutempojn};
                  
            foxvortaro.prefiksoj =  {
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
                  
            foxvortaro.sufiksoj = { 
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
			},
						
		run : function () {
			foxvortaro.run_vorto('');
		},
		
		run_vorto : function (vorto) {
			var teksto = vorto != '' ? vorto : foxvortaro.normaligu(foxvortaro.elektita_teksto());
			
			if (teksto.length != 0){
				var tradukita = foxvortaro.traduku_vortoj(teksto);
				
				if (tradukita != null){
					foxvortaro.montrupanelon(tradukita);
					//alert(tradukita.v + ': ' + tradukita.t);
				}else {
					//alert("!Vorto '" + teksto + "' ne trovita!");
					foxvortaro.montrueraron(teksto);
				}
			}
		},
			
		montrupanelon : function (teksto, eraro) {
			var doc = content.document;
			var fenestro = window.openDialog("", "EORU_Vortaro", 'chrome,centerscreen,width=500,height=150,scrollbars=yes,resizable=yes');
			var title = $('<title>', doc).append('Eo-Ru Vortaro');
			var csslink = $('<link>', doc).attr('rel', 'stylesheet')
										  .attr('type', 'text/css')
										  .attr('href', 'chrome://foxvortaro/skin/skin.css');
			var body1 = $('<body>', doc).append(teksto);
			if (eraro) body1.attr('bgcolor', '#EA5744');
			
			var cnt =  $('<html>', doc).append($('<head>', doc).append(title).append(csslink)).append(body1);
			var html = $('<div>', doc).append(cnt.clone()).remove().html();
			
			fenestro.document.write(html);
			fenestro.document.close();
			fenestro.focus();
		},
			
		montrueraron : function (vorto) {
			foxvortaro.montrupanelon("Vorto " + foxvortaro.htmligu(vorto) + " ne trovita!", true);
		},
			
		traduku_vortoj : function (teksto) {
			teksto = teksto.replace(/[^\w\d]+/g, " ").replace(/\s\s+/gi, " ");
			var vortoj = teksto.split(" ");
			
			vortoj2 = new Array();
			
			// forigu duplikatoj
			for(var i = 0;i < vortoj.length;i++){
				var vrt = foxvortaro.trim(vortoj[i]).toLowerCase();
				
				if (vrt != '' && vortoj2.indexOf(vrt) < 0){
					vortoj2.push(vrt);
				}
				
				if (vortoj2.length >= foxvortaro.maksKvanto){
					break;
				}
			}
			
			var doc = content.document;
			var tabelo = $('<table>', doc).attr('class', 'spec');
			
			for(var i = 0;i < vortoj2.length;i++){
				var vorto = vortoj2[i];
				var rez = foxvortaro.traduku(vorto);
					
				if (rez != null)
					tabelo.append(foxvortaro.tabeligi(rez.v, rez.t));
				else
					tabelo.append(foxvortaro.tabeligi(vorto, null));
			}
			
			var html = $('<div>', doc).append(tabelo.clone()).remove().html();
			
			return html;
		},
			
		tabeligi : function(col1, col2){
			var doc = content.document;
			var ttr = $('<tr>', doc).append($('<td>', doc).append($('<b>', doc).append(foxvortaro.htmligu(col1))));
			
			if (col2 == null)
				ttr.append($('<td>', doc).append($('<b>', doc).append($('<div>', doc).attr('style', 'color:red').append('Vorto estas ne trovita!'))));
			else
				ttr.append($('<td>', doc).append($('<b>', doc).append(foxvortaro.htmligu(col2))));
			
			return ttr;
		},
			
		traduku : function (teksto) {
			
			if (teksto == null || teksto.length <= 0) return null;
			
			var result = foxvortaro.trovu(teksto);
			if (result != null) return result;
			
			result = foxvortaro.trovuradikon(teksto);
			if (result != null) return result;
			
			for(var func in foxvortaro.funcs){
				var teksto2 = foxvortaro.funcs[func](teksto);
				
				if (teksto != teksto2){
					result = foxvortaro.trovu(teksto2);
					if (result != null) return result;
					teksto = teksto2;
					result = foxvortaro.trovuradikon(teksto);
					if (result != null) return result;
				}
			}
			
			if (foxvortaro.havifinajxon(teksto)){
				teksto3 = teksto.substr(0, teksto.length - 1);
				result = foxvortaro.trovuradikon(teksto3);
				if (result != null) return result;
			}
			
			result = foxvortaro.trovualianformon(teksto);
			if (result != null) return result;
			
			return null;
		},
			
		trovupersufiksoj : function (teksto) {
			
			result = foxvortaro.trovuradikon(teksto);
			if (result != null) return result;
			
			// forigi cxiujn prefiksojn
			do{
				var trovita = false;
				
				for(var suf in foxvortaro.sufiksoj){
					var sufiks = foxvortaro.sufiksoj[suf];
					var idx = teksto.lastIndexOf(sufiks);
					
					if (idx > 0 && idx == (teksto.length - sufiks.length)){
						teksto = teksto.substr(0, teksto.length - sufiks.length);
						trovita = true;
						break;
					}
				}
				
				var finu = true;
				
				if (trovita){
					result = foxvortaro.trovuradikon(teksto);
					if (result != null) return result;
					finu = false;
				}
			}while(!finu);
			
			return null;
		},
		
		trovualianformon : function (teksto) {
			teksto = teksto.toLowerCase();
			var rezultoj = new Array();
			
			if (foxvortaro.havifinajxon(teksto)){
				teksto = teksto.substr(0, teksto.length - 1);
			}
			
			var result = foxvortaro.trovupersufiksoj(teksto);
			if (result != null){
				rezultoj.push(result);
			}
			
			do{
				var trovita = false;
				
				for(var pref in foxvortaro.prefiksoj){
					var prefiks = foxvortaro.prefiksoj[pref];
					var idx = teksto.indexOf(prefiks);
					
					if (idx == 0){
						teksto = teksto.substr(prefiks.length);
						trovita = true;
						break;
					}
				}
				
				if (trovita){
					var result = foxvortaro.trovupersufiksoj(teksto);
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
			
			for(var vorto in foxvortaro.vortoj){
				
				var linio = foxvortaro.vortoj[vorto];
				
				if (teksto == linio.v.toLowerCase()){
					if (vortorezulto == '') vortorezulto = linio.v;
					
					if (result == ''){
						result = foxvortaro.trim(linio.t);
						index = 1;	
					} else if (index == 1){
						result = "1. " + result + "\n2. " + foxvortaro.trim(linio.t);
						index = 2;
					} else {
						result += "\n" + ++index + ". " + foxvortaro.trim(linio.t);
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
			
			for(var vorto in foxvortaro.vortoj){
				var linio = foxvortaro.vortoj[vorto];
				
				if (radiko.length < linio.v.length && radiko == linio.v.substr(0, linio.v.length - 1).toLowerCase()){
					return foxvortaro.trovu(linio.v);
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
			return foxvortaro.trim(str.replace(/ĉ/gi, "cx").replace(/ĝ/gi, "gx").replace(/ŝ/gi, "sx")
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