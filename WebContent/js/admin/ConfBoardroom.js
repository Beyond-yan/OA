/**
 * 
 * @class ConfBoardroom
 * @extends Ext.Panel
 * @description 会议状态查询
 * 
 */
ConfBoardroom = Ext.extend(Ext.Panel, {
	// 搜索
	searchPanel : null,
	// 数据展示Panel
	// gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	picPanel : null,
	sizeStore : null,

	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ConfBoardroom.superclass.constructor.call(this, {
					id : 'ConfBoardroom',
					title : '会议室查询及预约',
					iconCls : 'menu-confApply',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.picPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + '/admin/listConferenceBoardroo.do',
					root : 'result',
					totalProperty : 'totalCounts',
					autoLoad : true,
					listeners:{
						load : function(store, record, opts) {
							var fm = Ext.getCmp('ConfBoardroom.picPanel');
							var html = fm.getHtml(store);
							fm.update(html);
						}
					},
					//fields : ['confId', 'startTime', 'endTime', 'roomId', 'roomName','applyStatus', 'createBy','appUser.fullname','compereName','confTopic']  //cxt20110714
					//fields : ['roomId', 'roomname','applyStatus', 'confs.confId', 'confs.startTime', 'confs.endTime','confs.contUser.fullname','confs.confTopic','confs.timeNumber','confs.timeType']
					fields : ['roomId', 'roomname','applyStatus', 'confs','roomType','containnum','location','projector','roomdesc']
				});
		// 加载数据

		// start of this searchPanel
		this.searchPanel = new Ext.FormPanel({
			layout : 'form',
			region : 'north',
			width : '98%',
			height : 90,
			frame : true,
			id : 'ConfBoardroom.id',
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.search.createCallback(this),
				scope : this
			},
			items : [{
				items : [{
					layout : 'column',
					items : [{
						layout : 'form',
						columnWidth : 0.33,
						items : [{
							xtype : 'combo',
							hiddenName : 'Q_roomId_L_EQ',
							width : 160,
							fieldLabel : '会议室名称',
							valueField : 'roomId',
							//id : 'boardsearch.roomId',
							id : 'ConfBoardroom.roomId',						
							displayField : 'roomName',
							mode : 'local',
							editable : false,
							emptyText : '',
							triggerAction : 'all',
							store : new Ext.data.SimpleStore({
										url : __ctxPath
												+ '/admin/getBoardrooConference.do?', //
										//method : 'post',
										autoLoad : true,
										fields : ['roomId', 'roomName'],
										listeners : {
											scope : this,
											load : function() {
												var cmp = Ext.getCmp('ConfBoardroom.roomId');
												if(cmp.hiddenField.value =='') cmp.setValue('');
												if (cmp.hiddenField.value && cmp.hiddenField.value !='')
													cmp.setValue(cmp.hiddenField.value);
												
											}
										}
									})
						}]
					}, {
						layout : 'form',
						columnWidth : 0.33,
						items : [{
									fieldLabel : '开始时间',
									//id : 'startTime',
								id : 'ConfBoardroom.startTime',
									xtype : 'datefield',
									name : 'Q_startTime_D_GE',
									format : 'Y-m-d',
									width : 160,
									editable : false
								}]
					}/*, {
						layout : 'form',
						columnWidth : 0.33,
						items : [{
									fieldLabel : '结束时间',
									//id : 'endTime',
									id : 'ConfBoardroom.endTime',
									
									xtype : 'datefield',
									name : 'Q_endTime_DG_LE',
									format : 'Y-m-d',
									width : 160,
									editable : false
								}]
					}*/]
				}]
			},{
			items : [{
				layout : 'hbox',
				region : 'center',
				style : 'padding-left:27.5%',
				border : false,
				layoutConfig : {
					padding : '5px',
					align : 'center'
				},
				defaults : {
					xtype : 'button',
					width : 70,
					height : 25,
					margins : {
						left : 4,
						top : 0,
						right : 4,
						bottom : 0
					}
				},
				items : [{
					xtype : 'label',
					style : 'padding-left:40%;',
					text : ' '
				}, {
					iconCls : 'search',
					text : '查询',
//					style : 'padding-left:40%;',
					handler : this.search.createCallback(this)
				}, {
					iconCls : 'btn-reset',
//					 style : 'padding-left:50%;',
					text : '重置',
					handler : this.reset.createCallback(this)
				}, {
					text : '预约',
//					style : 'padding-left:60%;',
					handler : function() {
						// this.addConf.createCallback(this)
							App.clickTopTab('AddConferenceForm');
					}
				}]
			}]
			}]
			/*buttons : [{
						iconCls : 'search',
						text : '查询',
						handler : this.search.createCallback(this)
					}, {
						iconCls : 'btn-reset',
						// style : 'padding-right:40%;',
						text : '重置',
						handler : this.reset.createCallback(this)
					}, {
						text : '预约',
						handler : function() {
							// this.addConf.createCallback(this)
								App.clickTopTab('AddConferenceForm');
						}
					}]*/
		}); // end of this superSearchPanel
		
		this.picPanel = new Ext.Panel({
					height : 550,
					id : 'ConfBoardroom.picPanel',
					region : 'center',
					// store : this.store,
					html : '',
					getHtml:getHtml,
					autoScroll : true
				});
	
		
		function getHtml(store) {
			var systemDate = document.getElementById('systemDate').value;//从index.jsp获取系统时间
			var newSystemDate = Date.parseDate(systemDate,'Y-m-d h:i:s');
			var nowDate = new Date();
			var recordNum = store.getTotalCount();//获取store中的总数目
			var newStart = Ext.getCmp('ConfBoardroom.startTime').getValue();
			var htmlTime = "";
			var dt = newSystemDate;
			for(var i = 0; i<7; i++){
				if(null == newStart || "" == newStart){
					dt = newSystemDate.add(Date.DAY,i);
				}else{
					dt = newStart.add(Date.DAY,i);
				}
				htmlTime += '<TD colspan =\"2\"  align=\"Center\" width=\'10%\' bordercolor =\"#000000\">'
					+ dt.format('Y-m-d') +'</TD>'
			}; 
			var tempForRoomId = 0;//用于判断同一会议室被预定的会议室id是否一样：一样，同一行刻画；反之另起一行
			var tdFirst = '<td width=\"80\" align=\"Center\" height=\"30\">';
			var tdEnd = '</td>';
			var trEnd = '</tr>';
			var storeTemp = new Ext.data.JsonStore({
						fields : [{
									name : 'roomId',
									type : 'int'
								}, 'roomName', 'createBy', 'applyStatus',
								'startValue', 'endValue', 'dateNum',
								'startDateToDate','appUser.fullname','compereName','confTopic',
								'timeType','timeNumber','contactTel']
					});
			var record = new Ext.data.Record.create([{
						name : 'roomId'//会议室Id
					}, {
						name : 'roomName'//会议室名称
					}, {
						name : 'createBy'//创建人
					}, {
						name : 'applyStatus'//会议的申请状态：1、申请中；2是审批通过
					}, {
						name : 'startValue'//开始时间的格子位置
					}, {
						name : 'startTime'//开始时间
					}, {
						name : 'endTime'//结束时间
					}, {
						name : 'endValue'//结束时间的格子位置
					}, {
						name : 'dateNum'//同一会议室不同日期的标志，如果是同一会议室同一天则大小一样
					}, {
						name : 'startDateToDate'//会议室申请的时间，用于刻画日期
					}, {
						name : 'appUser.fullname'	//申请人				
					},{
					    name:'compereName'							
					},{
					    name:'confTopic'	//会议主题				
					},{
					    name:'contactTel'	//会议创建人联系电话
					},{
						name : 'timeType' //会议时间0：上午，1：下午，2全天
					},{
						name : 'timeNumber' //会议持续的时间(天数)
					}]);			
//拼会议室查询页面的抬头
			var html = '<table cellspacing=\"0\" cellpadding=\"3\" rules=\"all\" bordercolor=\"Black\" border=\"1\" id=\"adgReport\" style=\"border-color:Black;border-width:1px;border-style:Outset;width:100%;border-collapse:collapse;\">'
					+ '<tr align=\"Center\" style=\"color:window;background-color:#7EB1FF;font-family:Tahoma;font-size:9pt;\">'
					+ '<TD align=\"center\" height=\"30\" bordercolor =\"#000000\"   width =\"8%\" >开会时间段</TD>'					
					+ htmlTime
					+ '</tr><tr>'
					+ '<TD align=\"center\" height=\"30\" style=\"color:window;background-color:#7EB1FF;font-family:Tahoma;font-size:9pt;\" bordercolor =\"#000000\">会议室</TD>'
					+ '<td align=\"Center\">上午</td><td align=\"Center\">下午</td><td align=\"Center\">上午</td><td align=\"Center\">下午</td><td align=\"Center\">上午</td><td align=\"Center\">下午</td><td align=\"Center\">上午</td><td align=\"Center\">下午</td><td align=\"Center\">上午</td><td align=\"Center\">下午</td><td align=\"Center\">上午</td><td align=\"Center\">下午</td><td align=\"Center\">上午</td><td align=\"Center\">下午</td>'
					+ '</tr>';
			var roomId = ""; //存放store中当前会议室id
			var roomId2 = '';//存放store上一笔的会议室Id
			var startTime02 = '';//store上一笔的会议开始日期
			var changeFirst = '<td height="30"';
			var begin = 0;
			
			var temp001, temp002, tempFor002 = 28, temp007 = 0;
			
			for(var i = 0; i < recordNum; i++){
				roomId = store.getAt(i).get('roomId');
				var roomName = store.getAt(i).get('roomname');
				var proJector = store.getAt(i).get('projector') == 0 ? "无" : "有";
				var roomDesc = store.getAt(i).get('roomdesc') == null ? "无" : store.getAt(i).get('roomdesc') ;
				html = html + '<tr align=\"Center\" style=\"font-fmily:Tahoma;font-size:9pt;\">'
					+'<td bgcolor=\"#7EB1FF\" ' 
					+ " qtip= \" "
					+ "会议室类型：" +store.getAt(i).get('roomType')
					+ "</br>容纳人数：" +store.getAt(i).get('containnum') +"人"
					+ "</br>位置：" +store.getAt(i).get('location') 
					+ "</br>是否有投影仪：" +proJector
					+ "</br>描述：" + roomDesc
					+ " \" "
					+ '>'
					+'<font color=\"white\">'
					+ roomName
					
					+'</font></td>';
					
				var confs = store.getAt(i).get('confs');
				if(confs.length == 0){
					for(var tdi = 0; tdi<14; tdi++){
						var timeStart01 = null;
						if(null == newStart || "" == newStart){
							timeStart01 = newSystemDate.add(Date.DAY, parseInt(tdi/2)).format('Y-m-d');
						}else{
							timeStart01 = newStart.add(Date.DAY, parseInt(tdi/2)).format('Y-m-d');
						}
						var timeType01 = tdi % 2;
						if(0 == tdi % 2){
							tempStartTime = " 09:00";
							tempEndTime = " 12:00";
						}else if(1 == tdi %2){
							tempStartTime = " 14:00";
							tempEndTime = " 17:30";
						}
						tempStartTime = timeStart01 + tempStartTime;
						tempEndTime = timeStart01 + tempEndTime;
						var tFE='<td width=\"80\" height=\"30\"';
							tFE += 'style=\"cursor:pointer\" onClick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
								roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+ '\',tempStartTime:\'' + tempStartTime + '\',tempEndTime:\'' + tempEndTime  +'\',timeType:\'' + timeType01 +'\'})"';
						tFE += '>';
						tFE = tFE +'&nbsp;</td>';//没有填充数据的单元格子
						html = html + tFE;
					}
					html = html + trEnd;
				}
				for(var len=0;len<confs.length;len++){
					var conf = confs[len];
					var oldStartTime = new Date(conf.startTime);
					var oldEndTime = new Date(conf.endTime);
					var applyName = conf.appUser?conf.appUser.fullname:"";
					var applyStatus = conf.applyStatus;
					var confTopic = conf.confTopic;
					var timeType = conf.timeType;
					var timeNumber = conf.timeNumber;
					var contactTel = conf.contactTel;
					var startTime = oldStartTime;
					var confContent = conf.confContent;
					/**
					 * 根据addHours和addMinutes来共同判断上下午addHours确定小时addMinutes确定分钟
					 * 例：若addHours=13,addMinutes=30则13点30分之前（包括13点30分）都为上午，超过为下午
					 * 目前上午为12点00分（包括12点00分）
					 */
					var addHours = 12;
					var addMinutes = 0;
					var remStartTime = null;
					var remEndTime = null;
					if(null == newStart || "" == newStart){
						if(oldStartTime.format('Y-m-d') < newSystemDate.format('Y-m-d')){
							for(var num1 = 1; num1 <= timeNumber; num1++){
								if(oldStartTime.add(Date.DAY, num1).format('Y-m-d') == newSystemDate.format('Y-m-d')){
									timeNumber = timeNumber - num1;
									break;
								}
							}
							oldStartTime = newSystemDate;
						}
					}else{
						if(oldStartTime < newStart){
							for(var num1 = 1; num1 <= timeNumber; num1++){
								if(oldStartTime.add(Date.DAY, num1).format('Y-m-d') == newStart.format('Y-m-d')){
									timeNumber = timeNumber - num1;
									break;
								}
							}
							oldStartTime = newStart;
						}
					}
					
					var days = 0;
					for(var j = 0; j<7; j++){
						var startTime01 = oldStartTime.format('Y-m-d');
						var nowdays = null;
						if(null == newStart || "" == newStart){
							nowdays = newSystemDate.add(Date.DAY, j).format('Y-m-d');
						}else{
							nowdays = newStart.add(Date.DAY, j).format('Y-m-d');
						}
						if(nowdays == startTime01){
							days = j;
							break;
						}
					}
					if(0 == timeType%2){
						temp01 = days * 2+14;
						if(startTime.format('Y-m-d') >= newSystemDate.format('Y-m-d')){
							remStartTime = startTime;
							startTime = startTime.add(Date.HOUR, 12 - addHours);
							startTime = startTime.add(Date.MINUTE, - addMinutes);
							if(!(startTime.format('a') == 'am' || (12 == startTime.getHours() && 0 == startTime.getMinutes()))){
								temp01 = temp01 + 1;
							}
							startTime = remStartTime;
						}
					}else if(1 == timeType%2){
						temp01 = days * 2 + 15;
					}
					if(0 == timeType){
						temp02 = days * 2 + 15;
					}else if(1 == timeType){
						temp02 = days * 2 + 16;
					}else{
						temp02 = (days + timeNumber) * 2 + 14;
						if(oldEndTime.format('Y-m-d') < newSystemDate.add(Date.YEAR, 7).format('Y-m-d')){
							remEndTime = oldEndTime;
							oldEndTime = oldEndTime.add(Date.HOUR, 12 - addHours);
							oldEndTime = oldEndTime.add(Date.MINUTE, - addMinutes);
							if(oldEndTime.format('a') == 'am' || (12 == oldEndTime.getHours() && 0 == oldEndTime.getMinutes())){
								temp02 = temp02 - 1;
							}
							oldEndTime = remEndTime;
						}
					}
					if(temp02 > 28){
						temp02 = 28
					}
					storeTemp.add([new record({
						'roomId' : roomId,
						'roomName' : roomName,
						'createBy' : applyName,
						'startTime' : startTime,
						'endTime' : oldEndTime,
						'applyStatus' : applyStatus,
						'startValue' : temp01,
						'endValue' : temp02,
						'confTopic' : confTopic,
						'contactTel' : contactTel,
						'confContent' : confContent
					})]);
					
					temp001 = storeTemp.getAt(len).get('startValue');
					temp002 = storeTemp.getAt(len).get('endValue');
					if(len>0){
						temp007 = storeTemp.getAt(len - 1).get('endValue');
					}
					
					var applyStatus1 = storeTemp.getAt(len).get('applyStatus');
					var colorTemp = null;
					if(1 == applyStatus1){
						colorTemp = " bgcolor=\"#E1E100\"";
					}else if(2 == applyStatus1){
						colorTemp = " bgcolor=\"#00EC00\"";
					}
					tempFor002 = temp002;
					if(len == 0 && len == confs.length-1){
						for(var justFor0 = 14; justFor0 <temp001; justFor0++){
							var timeStart01 = null;
							var tempStartTime = null;
							var tempEndTime = null;
							if(null == newStart || "" == newStart){
								timeStart01 = newSystemDate.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}else{
								timeStart01 = newStart.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}	
							var timeType01 = justFor0 % 2;
							if(0 == justFor0 % 2){
								tempStartTime = " 09:00";
								tempEndTime = " 12:00";
							}else if(1 == justFor0 %2){
								tempStartTime = " 14:00";
								tempEndTime = " 17:30";
							}
							tempStartTime = timeStart01 + tempStartTime;//年月日、时分连接
							tempEndTime = timeStart01 + tempEndTime;
							var tFE = '<td width=\"80\" height=\"30\" ';
								tFE += 'style=\"cursor:pointer\" onclick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
									roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+'\',tempStartTime:\''+ tempStartTime+'\',tempEndTime:\''+ tempEndTime+'\',timeType:\'' + timeType01 +'\'})"';
							tFE += '>';
							tFE = tFE + '&nbsp;</td>';//没有填充数据的单元格子
							html = html + tFE;
						}
						var telNumber = storeTemp.getAt(len).get('contactTel') == null ? "空" : storeTemp.getAt(len).get('contactTel');
						var oldStartTime = storeTemp.getAt(len).get('startTime');
						var oldEndTime = storeTemp.getAt(len).get('endTime');
						var confCnotent=storeTemp.getAt(len).get('confContent')==null ?"无" : storeTemp.getAt(len).get('confContent');
						html = html + changeFirst
						+" align=\"Center\""
						+" colspan="
						+(temp002 - temp001)
						+" width=\""
						+(temp002 - temp001) * 80
						+"\""
						+ colorTemp
						+ " qtip=\'"
						+" 会议主题："+storeTemp.getAt(len).get('confTopic') + "</br>联系电话：" + telNumber 
						+ "</br>开始时间：" + Ext.util.Format.date(oldStartTime,'Y年m月d日  H时i分')
						+ "</br>结束时间：" + Ext.util.Format.date(oldEndTime,'Y年m月d日  H时i分')
						+ "</br>准备事项：" + confCnotent
						/*+ "</br>开始时间：" + oldStartTime.getYear()+"年" + (oldStartTime.getMonth()+1)+"月" + oldStartTime.getDate()+"日"+oldStartTime.getHours()+"时"+oldStartTime.getMinutes()+"分"
						+ "</br>结束时间：" + oldEndTime.getYear()+"年" + (oldEndTime.getMonth()+1)+"月" + oldEndTime.getDate()+"日"+oldEndTime.getHours()+"时"+oldEndTime.getMinutes()+"分"*/
						+"\' >"
						+ storeTemp.getAt(len).get('createBy')
						+ tdEnd;
						if(28 != tempFor002){
							for(var justFor0 = tempFor002 + 1; justFor0<=28; justFor0++){
								var timeStart01 = null;
								var tempStartTime = null;
								var tempEndTime = null;
								if(null == newStart || "" == newStart){
									timeStart01 = newSystemDate.add(Date.DAY, ((justFor0-1)/2 - 7)).format('Y-m-d');
								}else{
									timeStart01 = newStart.add(Date.DAY, ((justFor0-1)/2 - 7)).format('Y-m-d');
								}
								var timeType01 = (justFor0-1) % 2;
								if(0 == (justFor0-1) % 2){
									tempStartTime = " 09:00";
									tempEndTime = " 12:00";
								}else if(1 == (justFor0-1) %2){
									tempStartTime = " 14:00";
									tempEndTime = " 17:30";
								}
						tempStartTime = timeStart01 + tempStartTime;
						tempEndTime = timeStart01 + tempEndTime;
								var tFE = '<td width=\"80\" height=\"30\"';
									tFE += 'style=\"cursor:pointer\" onclick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
										roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+'\',tempStartTime:\''+ tempStartTime+'\',tempEndTime:\''+ tempEndTime+'\',timeType:\'' + timeType01 +'\'})"';
								tFE += '>';
								tFE = tFE + '&nbsp;</td>';//没有填充数据的单元格子
								html = html + tFE;
							}
							tempFor002 = 28;
						}
						html = html + trEnd;
					}else if(0 == len){
						for(var justFor0 = 14; justFor0 <temp001; justFor0++){
							var timeStart01 = null;
							var tempStartTime = null;
							var tempEndTime = null;
							if(null == newStart || "" == newStart){
								timeStart01 = newSystemDate.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}else{
								timeStart01 = newStart.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}
							var timeType01 = justFor0 % 2;
							if(0 == justFor0 % 2){
								tempStartTime = " 09:00";
								tempEndTime = " 12:00";
							}else if(1 == justFor0 %2){
								tempStartTime = " 14:00";
								tempEndTime = " 17:30";
							}
						tempStartTime = timeStart01 + tempStartTime;
						tempEndTime = timeStart01 + tempEndTime;
							var tFE = '<td width=\"80\" height=\"30\"';
								tFE += 'style=\"cursor:pointer\" onclick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
									roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+'\',tempStartTime:\''+ tempStartTime+'\',tempEndTime:\''+ tempEndTime+'\',timeType:\'' + timeType01 +'\'})"';
							tFE += '>';
							tFE = tFE + '&nbsp;</td>';//没有填充数据的单元格子
							html = html + tFE;
						}
						var telNumber = storeTemp.getAt(len).get('contactTel') == null ? "空" : storeTemp.getAt(len).get('contactTel');
						var oldStartTime = storeTemp.getAt(len).get('startTime');
						var oldEndTime = storeTemp.getAt(len).get('endTime');
						var confCnotent=storeTemp.getAt(len).get('confContent')==null ?"无" : storeTemp.getAt(len).get('confContent');
						html = html + changeFirst
						+" align=\"Center\""
						+" colspan="
						+(temp002 - temp001)
						+" width=\""
						+(temp002 - temp001) * 80
						+"\""
						+ colorTemp
						+ " qtip=\'"
						+" 会议主题："+storeTemp.getAt(len).get('confTopic') + "</br>联系电话：" + telNumber 
						+ "</br>开始时间：" + Ext.util.Format.date(oldStartTime,'Y年m月d日  H时i分')
						+ "</br>结束时间：" + Ext.util.Format.date(oldEndTime,'Y年m月d日  H时i分')
						+ "</br>准备事项：" + confCnotent
						/*+ "</br>开始时间：" + oldStartTime.getYear()+"年" + (oldStartTime.getMonth()+1)+"月" + oldStartTime.getDate()+"日"+oldStartTime.getHours()+"时"+oldStartTime.getMinutes()+"分"
						+ "</br>结束时间：" + oldEndTime.getYear()+"年" + (oldEndTime.getMonth()+1)+"月" + oldEndTime.getDate()+"日"+oldEndTime.getHours()+"时"+oldEndTime.getMinutes()+"分"*/
						+"\' >"
						+ storeTemp.getAt(len).get('createBy')
						+ tdEnd;
					}else if(len == confs.length-1){
						for(var justFor0 = temp007; justFor0 < temp001; justFor0++){
							var timeStart01 = null;
							var tempStartTime = null;
							var tempEndTime = null;
							if(null == newStart || "" == newStart){
								timeStart01 = newSystemDate.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}else{
								timeStart01 = newStart.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}
							var timeType01 = justFor0 % 2;
							if(0 == justFor0 % 2){
								tempStartTime = " 09:00";
								tempEndTime = " 12:00";
							}else if(1 == justFor0 %2){
								tempStartTime = " 14:00";
								tempEndTime = " 17:30";
							}
						tempStartTime = timeStart01 + tempStartTime;
						tempEndTime = timeStart01 + tempEndTime;
							var tFE = '<td width=\"80\" height=\"30\"';
								tFE += 'style=\"cursor:pointer\" onclick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
									roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+'\',tempStartTime:\''+ tempStartTime+'\',tempEndTime:\''+ tempEndTime+'\',timeType:\'' + timeType01 +'\'})"';
							tFE += '>';
							tFE = tFE + '&nbsp;</td>';//没有填充数据的单元格子
							html = html + tFE;
						}
						var telNumber = storeTemp.getAt(len).get('contactTel') == null ? "空" : storeTemp.getAt(len).get('contactTel');
						var oldStartTime = storeTemp.getAt(len).get('startTime');
						var oldEndTime = storeTemp.getAt(len).get('endTime');
						var confCnotent=storeTemp.getAt(len).get('confContent')==null ?"无" : storeTemp.getAt(len).get('confContent');
						html = html + changeFirst
						+" align=\"Center\""
						+" colspan="
						+(temp002 - temp001)
						+" width=\""
						+(temp002 - temp001) * 80
						+"\""
						+ colorTemp
						+ " qtip=\'"
						+" 会议名称："+storeTemp.getAt(len).get('confTopic') + "</br>联系电话：" + telNumber 
						+ "</br>开始时间：" + Ext.util.Format.date(oldStartTime,'Y年m月d日  H时i分')
						+ "</br>结束时间：" + Ext.util.Format.date(oldEndTime,'Y年m月d日  H时i分')
						+ "</br>准备事项：" + confCnotent
						/*+ "</br>开始时间：" + oldStartTime.getYear()+"年" + (oldStartTime.getMonth()+1)+"月" + oldStartTime.getDate()+"日"+oldStartTime.getHours()+"时"+oldStartTime.getMinutes()+"分"
						+ "</br>结束时间：" + oldEndTime.getYear()+"年" + (oldEndTime.getMonth()+1)+"月" + oldEndTime.getDate()+"日"+oldEndTime.getHours()+"时"+oldEndTime.getMinutes()+"分"*/
						+"\' >"
						+ storeTemp.getAt(len).get('createBy')
						+ tdEnd;
						if(28 != tempFor002){
							for(var justFor0 = tempFor002 + 1; justFor0<=28; justFor0++){
								var timeStart01 = null;
								var tempStartTime = null;
								var tempEndTime = null;
								if(null == newStart || "" == newStart){
									timeStart01 = newSystemDate.add(Date.DAY, ((justFor0-1)/2 - 7)).format('Y-m-d');
								}else{
									timeStart01 = newStart.add(Date.DAY, ((justFor0-1)/2 - 7)).format('Y-m-d');
								}
								var timeType01 = (justFor0-1) % 2;
								if(0 == (justFor0-1) % 2){
									tempStartTime = " 09:00";
									tempEndTime = " 12:00";
								}else if(1 == (justFor0-1) %2){
									tempStartTime = " 14:00";
									tempEndTime = " 17:30";
								}
						tempStartTime = timeStart01 + tempStartTime;
						tempEndTime = timeStart01 + tempEndTime;
								var tFE = '<td width=\"80\" height=\"30\"';
									tFE += 'style=\"cursor:pointer\" onclick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
										roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+'\',tempStartTime:\''+ tempStartTime+'\',tempEndTime:\''+ tempEndTime+'\',timeType:\'' + timeType01 +'\'})"';
								tFE += '>';
								tFE = tFE + '&nbsp;</td>';//没有填充数据的单元格子
								html = html + tFE;
							}
							tempFor002 = 28;
						}
						html = html + trEnd;
					}else{
						for(var justFor0 = temp007; justFor0 < temp001; justFor0++){
							var timeStart01 = null;
							var tempStartTime = null;
							var tempEndTime = null;
							if(null == newStart || "" == newStart){
								timeStart01 = newSystemDate.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}else{
								timeStart01 = newStart.add(Date.DAY, (justFor0/2 - 7)).format('Y-m-d');
							}
							var timeType01 = justFor0 % 2;
							if(0 == justFor0 % 2){
								tempStartTime = " 09:00";
								tempEndTime = " 12:00";
							}else if(1 == justFor0 %2){
								tempStartTime = " 14:00";
								tempEndTime = " 17:30";
							}
						tempStartTime = timeStart01 + tempStartTime;
						tempEndTime = timeStart01 + tempEndTime;
							var tFE = '<td width=\"80\" height=\"30\"';
								tFE += 'style=\"cursor:pointer\" onclick="App.MyDesktopClickTopTab(\'AddConferenceForm\',{roomName:\''+
									roomName+'\',roomId:\''+roomId+'\',startDate:\''+ timeStart01+'\',tempStartTime:\''+ tempStartTime+'\',tempEndTime:\''+ tempEndTime+'\',timeType:\'' + timeType01 +'\'})"';
							tFE += '>';
							tFE = tFE + '&nbsp;</td>';//没有填充数据的单元格子
							html = html + tFE;
						}
						var telNumber = storeTemp.getAt(len).get('contactTel') == null ? "空" : storeTemp.getAt(len).get('contactTel');
						var oldStartTime = storeTemp.getAt(len).get('startTime');
						var oldEndTime = storeTemp.getAt(len).get('endTime');
						var confCnotent=storeTemp.getAt(len).get('confContent')==null ?"无" : storeTemp.getAt(len).get('confContent');
						html = html + changeFirst
						+" align=\"Center\""
						+" colspan="
						+(temp002 - temp001)
						+" width=\""
						+(temp002 - temp001) * 80
						+"\""
						+ colorTemp
						+ " qtip=\'"
						+" 会议主题："+storeTemp.getAt(len).get('confTopic') + "</br>联系电话：" + telNumber 
						+ "</br>开始时间：" + Ext.util.Format.date(oldStartTime,'Y年m月d日  H时i分')
						+ "</br>结束时间：" + Ext.util.Format.date(oldEndTime,'Y年m月d日  H时i分')
						+ "</br>准备事项：" + confCnotent
						/*+ "</br>开始时间：" + oldStartTime.getYear()+"年" + (oldStartTime.getMonth()+1)+"月" + oldStartTime.getDate()+"日"+oldStartTime.getHours()+"时"+oldStartTime.getMinutes()+"分"
						+ "</br>结束时间：" + oldEndTime.getYear()+"年" + (oldEndTime.getMonth()+1)+"月" + oldEndTime.getDate()+"日"+oldEndTime.getHours()+"时"+oldEndTime.getMinutes()+"分"*/
						+"\' >"
						+ storeTemp.getAt(len).get('createBy')
						+ tdEnd;
					}
				
					tempFor002 = temp002;
					temp007 = temp002;
				}
				storeTemp.removeAll();
			}
			
			
			/*for(var i = 0; i < recordNum; i++){
				roomId = store.getAt(i).get('roomId');
				var roomName = store.getAt(i).get('roomname');
				html = html + '<tr align=\"Center\" style=\"font-fmily:Tahoma;font-size:9pt;\">'
					+'<td rowspan=\"2\" bgcolor=\"#7EB1FF\" >'
					+'<font color=\"white\">'
					+ storeTemp.getAt(i).get('roomName');
					+'</font></td>';
					
				var applyStatus1 = storeTemp.getAt(temp).get('applyStatus');
				if(1 == applyStatus1){
					colorTemp = " bgcolor=\"#00EC00\"";
				}else if(2 == applyStatus1){
					colorTemp = " bgcolor=\"#E1E100\"";
				}
				temp001 = storeTemp.getAt(temp).get('startValue');
				temp002 = storeTemp.getAt(temp).get('endValue');
				if(0 == temp){
					for(var justFor0 = 14; justFor0 <temp001; justFor0++){
						html = html + tFE;
					}
				}else if(temp == storeTemp.getCount()-1){
					if(28 != tempFor002){
						for(var justFor0 = tempFor002 + 1; justFor0<=28; justFor0++){
							html = html + tFE;
						}
						tempFor002 = 28;
					}
					html = html + '</tr>';
				}else{
					for(var justFor0 = temp007; justFor0 < temp001; justFor0++){
						html += tFE;
					}
				}
				html = html + changeFirst
					+" align=\"Center\""
					+" clospan="
					+(temp002 - temp001)
					+" width=\""
					+(temp002 - temp001) * 15
					+"\""
					+ colorTemp
					+ " qtip=\""
					+"主持人: "
					+ storeTemp.getAt(temp).get('comperName')
					+" 会议主题："+storeTemp.getAt(temp).get('confTopic') +"\" >"
					+ storeTemp.getAt(temp).get('createBy')
					+ tdEnd;
				tempFor002 = temp002;
				temp007 = temp002;
			}*/

			html = html + '</table>';
			html = html + '<table>' + '<td></td>' + '<tr>'
					+ '<td>'+'单击空白处即可预约会议室'+'&nbsp;&nbsp;</td>'
					+ '<td  bgcolor=\"#E1E100\" width="7px">' + '</td>'
					+ '<td>' + ':表示会议室已被申请，并在审核中' + '<td width="6px"></td>'
					+ '</td>' + '<td  bgcolor=\"#00EC00\"  width="7px">'
					+ '</td>' + '<td>' + ':表示会议室已被申请，并已通过审核'
					+ '<td width="6px"></td>' +

					'</tr>' + '</table>';		
			return html;
		};

		function changeDate(date) {

			// 开始时间转换格式取时分值
			var d3 = date.replace(/\-/g, '\/');
			var date3 = new Date(d3);
			var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-"
					+ date3.getDate() + " " + date3.getHours() + ":"
					+ date3.getMinutes();
			var d3 = dd3.replace(/\-/g, '\/');
			var newDate = new Date(d3);
			return newDate;

		};

		function changeDateToDate(date) {

			// 开始时间转换格式取时分值
			var d3 = date.replace(/\-/g, '\/');
			var date3 = new Date(d3);
			var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-"
					+ date3.getDate();
			return dd3;

		};

	},// end of the initComponents()

	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法			
			var formatStartTime='';
			var formatEndTime='';
			if((Ext.getCmp('ConfBoardroom.startTime').getValue()!='')&&(Ext.getCmp('ConfBoardroom.startTime')!= 'undefined')){
				//当查询的开始时间不为空时，将时分秒初始值设为凌晨开始
				formatStartTime=Ext.getCmp('ConfBoardroom.startTime').getValue().format('Y-m-d');
		    }
			/*if((Ext.getCmp('ConfBoardroom.endTime').getValue()!='')&&(Ext.getCmp('ConfBoardroom.endTime')!= 'undefined')){
				//当查询的结束时间不为空时，将时分秒初始值设为23：59：59
				 formatEndTime=Ext.getCmp('ConfBoardroom.endTime').getValue().format('Y-m-d');
			    }*/			
			self.store.load({
						params : {
							//startTime : Ext.getCmp('ConfBoardrooSearch.startTime').getValue(),							
							//endTime : Ext.getCmp('ConfBoardrooSearch.endTime').getValue(),
							startTime :formatStartTime,
//							endTime : formatEndTime,
							roomId:Ext.getCmp('ConfBoardroom.roomId').getValue()
						}
					});
			// self.picPanel.update();
		}
	},

	/**
	 * 清空
	 */
	reset : function(self) {
		self.searchPanel.getForm().reset();
	},
	addConf : function(self) {
		new AddConferenceView();
		Ext.getCmp('ConfBoardroom').close();
	},
	/**
	 * 查看详细信息
	 */
	showDetail : function(confId) {
		// ConferenceDetailForm.show(confId);
		new ConfCompletedForm({
					confId : confId,
					btnV : '1' // 控制显示出退回的控件
				}).show();
	},

	/**
	 * 编辑记录,首先判断用户权限
	 */
	editRecord : function(record) {
		var confId = record.data.confId;
		var startTime = record.data.startTime;
		var endTime = record.data.endTime;
		new ConfCompletedForm({
					confId : confId
				}).show();
	}

	/*rowspan : function(store) {
		var size = store.getCount();
		for (var i = 0; i < size; i++) {
			temp001 = storeTemp.getAt(i).get('temp01');
			temp002 = storeTemp.getAt(i).get('temp02');
			var applyName001 = storeTemp.getAt(i).get('createBy');
			for (m; m < temp01; m++) {
				html = html + tFE;
			}
			
			 * for (var j = temp01; j < temp02; j++) { //用于填充对应时间内所有的格子 html =
			 * html + tdFirst + applyName + tdEnd; }
			 
			var changeFirst = '<td  height="45" ';
			html = html + changeFirst + " colspan=" + (temp02 - temp01)
					+ "  width=\"" + (temp02 - temp01) * 15 + "\""
					+ " bgcolor=\"#FF0000\ >" + applyName001 + tdEnd;
			colorNum = colorNum + (temp02 - temp01);
			m = temp02;
			justFor = temp02;
		}
	}*/

});
