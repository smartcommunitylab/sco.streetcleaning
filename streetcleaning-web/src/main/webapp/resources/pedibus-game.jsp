<!DOCTYPE html>
<html ng-app="cg" >
<head lang="it">
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>CLIMB</title>

<link href="css/bootstrap.min.css" rel="stylesheet" />
<link href="css/bootstrap-theme.min.css" rel="stylesheet" />
<link href="css/modaldialog.css" rel="stylesheet" />
<link href="css/colorpicker.css" rel="stylesheet" />
<link href="css/angular-awesome-slider.min.css" rel="stylesheet" type="text/css">
<link href="css/angular-spinkit.min.css" rel="stylesheet" />
<link href="css/style.css" rel="stylesheet" />
<!-- <link href="imgs/carpark.ico" rel="shortcut icon" type="image/x-icon" /> -->

<!-- required libraries -->
<script src="lib/jquery/jquery.min.js"></script>
<script src="lib/angular/angular.js"></script>
<script src="lib/angular/angular-route.min.js"></script>
<script src="lib/angular/angular-sanitize.min.js"></script>
<script src="lib/angular/angular-resource.min.js"></script>
<script src="lib/angular/angular-cookies.min.js"></script>
<script src="lib/angular/angular-awesome-slider.min.js" type="text/javascript"></script>
<script src="lib/angular/angular-spinkit.min.js"></script>
<script src="lib/angular/angular-base64.min.js"></script>

<script src="js/bootstrap.min.js"></script>
<script src="lib/bootstrap-colorpicker-module.min.js"></script>
<script src="lib/ui-bootstrap-tpls.min.js"></script>
<script src="js/localize.js" type="text/javascript"></script>
<script src="js/dialogs.min.js" type="text/javascript"></script>

<script src="i18n/angular-locale_it-IT.js"></script>
<script src="js/pg_app.js"></script>
<script src="js/controllers/pg_ctrl.js"></script>
<script src="js/controllers/pg_ctrl_main.js"></script>
<script src="js/controllers/pg_ctrl_gmap.js"></script>
<script src="js/services/serv.js"></script>
<script src="js/services/serv_shared.js"></script>
<script src="js/filters.js"></script>
<script src="js/directives.js"></script>

<script src="lib/shim.js" type="text/javascript"></script>
<script src="lib/polyline.js" type="text/javascript"></script>
<script src="lib/lodash.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBmKVWmFzh2JHT7q1MLmQRQ7jC4AhkRBDs&v=3.exp"></script>
<script src="lib/ng-map.min.js"></script>

<base href="<%=request.getContextPath()%>/" />

<script>
var token="<%=request.getAttribute("token")%>";
var conf_map_center="<%=request.getAttribute("map_center")%>";
var conf_map_zoom="<%=request.getAttribute("map_zoom")%>";
var conf_username="<%=request.getAttribute("gname")%>";
var conf_api="<%=request.getAttribute("api")%>";
</script>

<body>

<div id="myBody" ng-controller="MainCtrl" ng-init="setItalianLanguage()">
    <div class="navbar navbar-default navbar-fixed-top" role="navigation"><!-- navbar-inverse -->
      <div class="container-fluid" style="margin-left:160px; margin-right:160px">
        <div class="collapse navbar-collapse">
<!--           <div class="navbar-brand"><img src="imgs/logo.png"/></div> -->
          <ul class="nav navbar-nav">
			<li class="{{ isHomeActive() }}"><a href="pedibus-game" ng-click="setHomeActive()">HOME{{ 'menu_bar-home' | i18n }}</a></li>
            <li class="disabled" ng-if="isMapLinkDisabled()"><a href>MAPPA</a></li>
            <li class="{{ isMapActive() }}" ng-if="!isMapLinkDisabled()"><a href="pedibus-game/map" ng-click="setMapPageActive()">{{ 'menu_bar-consolemap' | i18n }}</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right" >
      		<li class=""><a href="pedibus-game" ng-show="!isMapLinkDisabled()" >{{ returnSchoolName() }}</a></li>
          	<!-- <li class="{{ isActiveItaLang() }}"><a href ng-click="setItalianLanguage()">IT</a></li>
          	<li class="{{ isActiveEngLang() }}"><a href ng-click="setEnglishLanguage()">EN</a></li> -->
            <li><a href="" ng-click="logout()" >LOGOUT{{ 'menu_bar-logout' | i18n }}</a></li>
          </ul>
        </div><!-- /.nav-collapse -->
      </div><!-- /.container -->
    </div><!-- /.navbar -->
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-1"></div>	
			<div class="col-md-10">
				<div class="panel panel-default" style="margin-top:100px;">
			  		<div class="panel-body">
			  			<div style="margin:5px 15px;">
							<div>
								<div ng-view class="row" >{{ 'loading_text'| i18n }}...</div>
							</div>
						</div>
						</div>
					</div>
				</div>
				<div class="col-md-1"></div>
			</div>
			<!-- <div class="row footer">
				<div class="col-md-12">
					<footer class="footer">
						<a href="http://www.streetlife-project.eu" target="_blank"><img src="img/STREETLIFE_logo.png" alt="{{ 'street_life_project' | i18n }}" title="{{ 'street_life_project' | i18n }}"></a>
					</footer>
				</div>
			</div> -->
		</div>
	</div>
</body>
</html>