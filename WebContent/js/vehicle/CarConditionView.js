/**
 * 
 * @class ConfBoardrooSearch
 * @extends Ext.Panel
 * @description 会议状态查询
 * 
 */
CarConditionView = Ext.extend(Ext.Panel, {
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
		CarConditionView.superclass.constructor.call(this, {
					id : 'CarConditionView',
					title : '车况参考及申请',
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
					url : __ctxPath + '/admin/listInTimeCar.do?',					
					method : 'post',
					root : 'result',
					remoteSort : true,
					autoLoad : false,
					fields : ['carIds', 'carNo', 'driver', 'reason', 'peopleAmount',
					'totalDistance', 'status', 'startTime', 'endTime',
					'notes', 'createBy']  // cxt20110714
				});
		// 加载数据
		// start of this searchPanel
		this.searchPanel = new Ext.FormPanel({
			layout : 'form',
			region : 'north',
			width : '98%',
			height : 90,
			frame : true,
			id : 'CarConditionView.id',
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.search.createCallback(this),
				scope : this
			},
			items : [{
				layout : 'column',
				items : [{
					layout : 'form',
					columnWidth : 0.33,
					items : [{
						xtype : 'textfield',
						width : 160,
						fieldLabel : '车牌号码',
						id : 'CarConditionView.carid'				
					}]
				}, {
					layout : 'form',
					columnWidth : 0.33,
					items : [{
								fieldLabel : '开始时间',
						    	id : 'CarConditionView.startTime',
								xtype : 'datefield',
								format : 'Y-m-d H:i',
								value:new Date(),
								width : 160,
								editable : false
							}]
				}, {
					layout : 'form',
					columnWidth : 0.33,
					items : [{
								fieldLabel : '结束时间',
								id : 'CarConditionView.endTime',								
								xtype : 'datefield',
								format : 'Y-m-d H:i',
								value:new Date().add(Date.DAY,1),
								width : 160,
								editable : false
							}]
				}]
			}],
			buttons : [{
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
							App.clickTopTab('AddConferenceView');
						}
					}]
		}); // end of this superSearchPanel

		this.picPanel = new Ext.Panel({
					height : 500,
					id : 'CarConditionView.picPanel',
					region : 'center',
					// store : this.store,
					html : '',
					getHtml:getHtml,
					autoScroll : true
				});
	
		var html;
		this.store.on("load", function(store, record, opts) {
					html = getHtml(store);
					var fm = Ext.getCmp('CarConditionView.picPanel');
					fm.update(html);
				});
	
		function getHtml(store) {
			var recordNum = store.getTotalCount();//获取store中的总数目
			var tempForDate = 0;//用于判断同一会议室被预定的日期是否一样：一样，同一行刻画；反之另起一行
			var tdFirst = '<td width="15" height="45">';
			var tdEnd = '</td>';
			var trEnd = '</tr>';
			var tFE = '<td width="15" height="45"></td>'//没有填充数据的单元格子
			var storeTemp = new Ext.data.JsonStore({
						fields : [{
									name : 'carid',
									type : 'int'
								}, 'roomName', 'createBy', 'applyStatus',
								'startValue', 'endValue', 'dateNum',
								'startDateToDate', 'compereName', 'confTopic',
								'days']
					});
			var record = new Ext.data.Record.create([{
						name : 'carid'//会议室Id
					}, {
						name : 'roomName'//会议室名称
					}, {
						name : 'createBy'//创建人
					}, {
						name : 'applyStatus'//会议的申请状态：1、申请中；2是审批通过
					}, {
						name : 'startValue'//开始时间的格子位置
					}, {
						name : 'endValue'//结束时间的格子位置
					}, {
						name : 'dateNum'//同一会议室不同日期的标志，如果是同一会议室同一天则大小一样
					}, {
						name : 'startDateToDate'//会议室申请的时间，用于刻画日期
					}, {
						name : 'endDateTODate'	//结束时间			
					},{
					    name:'compereName'							
					},{
					    name:'confTopic'	//原因			
					},{
					    name:'days'	//持续天数			
					}]);			
//拼会议室查询页面的抬头
			var html = '<table cellspacing=\"0\" cellpadding=\"3\" rules=\"all\" bordercolor=\"Black\" border=\"1\" id=\"adgReport\" style=\"border-color:Black;border-width:1px;border-style:Outset;width:100%;border-collapse:collapse;\">'
					+ '<tr align=\"Center\" style=\"color:window;background-color:#7EB1FF;font-family:Tahoma;font-size:9pt;\">'
					+ '<TD align=\"center\" bordercolor =\"#000000\" width=\'7%\'>车牌号码</TD>'
					+ '<TD align=\"center\" bordercolor =\"#000000\"   width =\"70\" >申请日期</TD>'					
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">08:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">09:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">10:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">11:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">12:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">13:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">14:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">15:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">16:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">17:00</TD>'
					+ '<TD colspan =\"2\"  align=\"center\" width=\'9%\' bordercolor =\"#000000\">18:00</TD>'
					+ '</tr><tr>'
					 + '<td align=\"Center\"  style=\"color:window;background-color:#7EB1FF;font-family:Tahoma;font-size:9pt;\">使用时间段</td>'
					 + '<td  align=\"center\"  style=\"color:window;background-color:#7EB1FF;font-family:Tahoma;font-size:9pt;\">时间区段</td>'
					+ '<td>08:00</td><td>08:30</td><td>09:00</td><td>09:30</td><td>10:00</td><td>10:30</td><td>11:00</td><td>11:30</td><td>12:00</td><td>12:30</td><td>13:00</td><td>13:30</td><td>14:00</td><td>14:30</td><td>15:00</td><td>15:30</td><td>16:00</td><td>16:30</td><td>17:00</td><td>17:30</td><td>18:00</td><td>18:30</td>'
					+ '</tr>';
			var carid = '';//存放store中当前会议室Id
			var carid2 = '';//存放store上一笔的会议室Id
			var startTime02 = '';//store上一笔的会议开始时间
			var changeFirst = '<td  height="45" ';
			var begin = 0;
			for (var i = 0; i < recordNum; i++) {
				//将store中的所有的数据进行判断，按照会议室Id存入storeTemp，并用dateNum标识不同的日期的数据
				carid = Ext.util.Format.number(store.getAt(i).get('carIds'),'0');//第i笔数据的会议室ID
				var startTime = store.getAt(i).get('startTime');
				var endTime = store.getAt(i).get('endTime');

				if(null!=startTime&&null!=endTime){
				// 开始时间转换格式取时分值
				var startDate = changeDate(startTime);
				// 结束时间转换格式取时分值
				var endDate = changeDate(endTime);
				var startDateToDate = startDate;//changeDateToDate(startTime);// 画日期的时间，格式是年-月-日				
				var endDateTODate=endDate;//changeDateToDate(endTime);
				var startPoint = startDate.getHours();//开始时间的小时数
				var endPoint = endDate.getHours();//结束时间的小时数
				var startminPoint = startDate.getMinutes();//开始时间的分钟
				var endminPoint = endDate.getMinutes();//结束时间的分钟
				//alert(startDate);alert(startDateToDate);alert(startPoint);alert(startminPoint);
				var applyStatus = store.getAt(i).get('status');//申请状态：申请中：1；审批通过：2
				var applyName = store.getAt(i).get('createBy');
				//var applyName = store.getAt(i).get('appUser.fullname');//申请人
				var roomName = store.getAt(i).get('carNo');//会议室名称
				//var compereName=store.getAt(i).get('compereName');
				var confTopic=store.getAt(i).get('reason');//原因				
				//if(compereName== null || compereName == 'undefined'){				
				//	compereName="无"
				//}
				var temp01 = 0;// 获取开始时间格子位置
				var temp02 = 0;// 获取结束时间格子位置

				if (startminPoint >= 30) {
					temp01 = startPoint * 2 + 1;//开始时间的分钟不小于30，开始时间的刻线在（格子位置=小时数*2+1），例如9点40的位置为19
				} else {
					temp01 = startPoint * 2;//反之，开始时间的刻线在(小时数*2)，例如9点的位置为18
				}			

				if (endminPoint == 0) {//结束时间的分钟比较
					temp02 = endPoint * 2;//结束时间的分钟是00，那么结束时间的刻线在(小时数*2)的位置，例如10：00在20格的位置
				} else if (endminPoint > 30) {
					temp02 = endPoint * 2 + 2;//结束时间的分钟超过30，结束时间的刻线在（小时数*2+2)的位置，例如10：40在20格的位置
				} else {
					temp02 = endPoint * 2 + 1;//结束时间的分钟=30，结束时间的刻线在（小时数*2+1)的位置，例如10：30在21格的位置
				}			


                var days=0;
				if(endDate.getHours()-startDate.getHours()>0){
				  days=Ext.util.Format.number((endDate-startDate)/86400000,'0');
				}else if(endDate.getHours()-startDate.getHours()==0){
				  if(endDate.getMinutes()-startDate.getMinutes()>=0){
				  days=Ext.util.Format.number((endDate-startDate)/86400000,'0');		  
				  }else{
				  days=Ext.util.Format.number(((endDate-startDate)/86400000)+1,'0');
				  }
				}else{
				  days=Ext.util.Format.number(((endDate-startDate)/86400000)+1,'0');
				}
				//alert(days);
				// 只将第一笔数据存入以下store
					storeTemp.add([new record({
								'carid' : carid,//会议室的id
								'roomName' : roomName,//会议室的名称
								'createBy' : applyName,//申请人
								'applyStatus' : applyStatus,//申请状态，申请中：1，审批通过：2
								'startValue' : temp01,//开始时间的格子位置
								'endValue' : temp02,//结束时间的格子位置
								'dateNum' : tempForDate,//同一会议室不同日期的标志，如果是同一会议室同一天则大小一样
								'startDateToDate' : startDateToDate,//会议室申请的时间，用于刻画日期
								//'compereName':compereName,
								'endDateTODate':endDateTODate,
								'confTopic':confTopic,//会议主题
								'days':days
							})]);				
		
				}}
				
				
					// 全部数据的最后一笔
					var temp001, temp002, tempFor002 = 48, temp007 = 0;
					var totdays=0;
					if (storeTemp.getCount() > 0) {
					

						for (var temp = 0; temp < storeTemp.getCount(); temp++) {//循环最后的store
							temp001 = storeTemp.getAt(temp).get('startValue');
							temp002 = storeTemp.getAt(temp).get('endValue');
							var colorTemp;
							var applyStatus2 = storeTemp.getAt(temp)
									.get('applyStatus');
							if (applyStatus2 == 1) {
								colorTemp = "  bgcolor=\"#00EC00\"";
							} else if (applyStatus2 == 2) {
								colorTemp = " bgcolor=\"#E1E100\"";
							}
							for(var d=0;d<=storeTemp.getAt(temp).get('days');d++){
							if(d==0){
							var dy=0;
							if (new Date(storeTemp.getAt(temp)
									.get('endDateTODate')).getHours()
									- new Date(storeTemp.getAt(temp)
											.get('startDateToDate')).getHours()>0){
											dy=parseInt(storeTemp.getAt(temp).get('days')) +1;
											Ext.util.Format.number()
											
											}else{
								dy=storeTemp.getAt(temp).get('days');
							}
								//alert(dy);
								html = html
								+ '<tr align=\"Center\" style=\"font-family:Tahoma;font-size:9pt;\"><td rowspan=\"'
								+ dy + '\" '  + ' bgcolor=\"#7EB1FF\" '+ '>' 										
								+'<font color=\"white\">'		
								+ storeTemp.getAt(temp).get('roomName') 
								+'</font>' 
								+'</td>';
								
								html = html
										+ '<td  bgcolor=\"#7EB1FF\" >'
										+'<font color=\"white\">'
										+ Ext.util.Format.date(storeTemp.getAt(temp)
												.get('startDateToDate'),'Y-m-d')
										+'</font>'		
										+ '</td>';
								for (var justFor0 = 16; justFor0 < temp001; justFor0++) {//从14格开始画：7点的开始位置
										html = html + tFE;//第一笔数据的开始刻线没到前，一直填充格子
									}
							if (d < storeTemp.getAt(temp).get('days')) {// 持续一天以上
								html = html + changeFirst + " align=\"Center\""
										+ " colspan="
										+ (tempFor002 - temp001)
										+ " width=\""
										+ (tempFor002 - temp001)
										* 15
										+ "\""
										+ colorTemp
										// + " qtip=\"修改接待方案\" >" //cxt20110714
										+ " qtip=\""
										+ "申请人："
										+ storeTemp.getAt(temp).get('createBy')
										+ " 原因："
										+ storeTemp.getAt(temp).get('confTopic')
										+ "\" >" // jihao
										+ storeTemp.getAt(temp).get('createBy')
										+ tdEnd;
							html = html + '</tr>';
							}else{
							html = html + changeFirst + " align=\"Center\""
										+ " colspan=" + (temp002 - temp001)
										+ " width=\"" + (temp002 - temp001)
										* 15 + "\"" + colorTemp 
										//+ " qtip=\"修改接待方案\" >" //cxt20110714
										+ " qtip=\""
											+"申请人："
											+ storeTemp.getAt(temp).get('createBy')
											+" 原因："+storeTemp.getAt(temp).get('confTopic')	+"\" >"  //jihao
										+ storeTemp.getAt(temp).get('createBy')
										+ tdEnd;
								tempFor002=temp002;
								if (tempFor002 != 48) {
										for (var justFor0 = tempFor002 + 1; justFor0 <= 48; justFor0++) {
											html = html + tFE;
										}
								tempFor002 = 48;
									}
									html = html + '</tr>';
										}
							}else if(d>0&&d<storeTemp.getAt(temp).get('days')){	
											
							html = html
								+ '<tr align=\"Center\" style=\"font-family:Tahoma;font-size:9pt;\"><td '
							    + ' bgcolor=\"#7EB1FF\" '+ '>' 										
								+'<font color=\"white\">'
								+ new Date(storeTemp.getAt(temp).get('startDateToDate')).add(Date.DAY,d).format('Y-m-d')
								+'</font>'	
								+'</td>';
								
								html = html + changeFirst + " align=\"Center\""
										+ " colspan="
										+ (tempFor002)
										+ " width=\""
										+ (tempFor002)
										* 15
										+ "\""
										+ colorTemp
										// + " qtip=\"修改接待方案\" >" //cxt20110714
										+ " qtip=\""
										+ "申请人："
										+ storeTemp.getAt(temp).get('createBy')
										+ " 原因："
										+ storeTemp.getAt(temp).get('confTopic')
										+ "\" >" // jihao
										+ storeTemp.getAt(temp).get('createBy')
										+ tdEnd;
								html = html + '</tr>';
							} else if (d > 0&& d == storeTemp.getAt(temp).get('days')&& temp002 != 0) {
							
							html = html
								+ '<tr align=\"Center\" style=\"font-family:Tahoma;font-size:9pt;\"><td '
							    + ' bgcolor=\"#7EB1FF\" '+ '>' 										
								+'<font color=\"white\">'
								+ new Date(storeTemp.getAt(temp).get('startDateToDate')).add(Date.DAY,d).format('Y-m-d')
								+'</font>'	
								+'</td>';
								
								html = html + changeFirst + " align=\"Center\""
										+ " colspan="
										+ (temp002)
										+ " width=\""
										+ (temp002)
										* 15
										+ "\""
										+ colorTemp
										// + " qtip=\"修改接待方案\" >" //cxt20110714
										+ " qtip=\""
										+ "申999请人："
										+ storeTemp.getAt(temp).get('createBy')
										+ " 原因："
										+ storeTemp.getAt(temp).get('confTopic')
										+ "\" >" // jihao
										+ storeTemp.getAt(temp).get('createBy')
										+ tdEnd;
										
								tempFor002=temp002;
								if (tempFor002 != 48) {
										for (var justFor0 = tempFor002 + 1; justFor0 <= 48; justFor0++) {
											html = html + tFE;
										}
								tempFor002 = 48;
									}
									html = html + '</tr>';							
							}							
							}										
					
						}
					}
							
			html = html + '</table>';
			html = html + '<table>' + '<td></td>' + '<tr>'
					+ '<td  bgcolor=\"#00EC00\" width="7px">' + '</td>'
					+ '<td>' + ':表示车辆已被预订' + '<td width="6px"></td>'
					+ '</td>' + '<td  bgcolor=\"#E1E100\"  width="7px">'
					+ '</td>' + '<td>' + ':表示车辆已被申请，并正在使用'
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
			if((Ext.getCmp('CarConditionView.startTime').getValue()!='')&&(Ext.getCmp('CarConditionView.startTime')!= 'undefined')){
				//当查询的开始时间不为空时，将时分秒初始值设为凌晨开始
				formatStartTime=Ext.getCmp('CarConditionView.startTime').getValue().format('Y-m-d 00:00:00');
		    }
			if((Ext.getCmp('CarConditionView.endTime').getValue()!='')&&(Ext.getCmp('CarConditionView.startTime')!= 'undefined')){
				//当查询的结束时间不为空时，将时分秒初始值设为23：59：59
				 formatEndTime=Ext.getCmp('CarConditionView.endTime').getValue().format('Y-m-d 23:59:59');
			    }			
			self.store.load({
						params : {							
							//startTime : Ext.getCmp('CarConditionView.startTime').getValue(),							
							//endTime : Ext.getCmp('CarConditionView.startTime').getValue(),
							start:0,
							limit:99999,
							startTime :formatStartTime,
							endTime : formatEndTime,
							carNo:Ext.getCmp('CarConditionView.carid').getValue()
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
		Ext.getCmp('ConfBoardrooSearch').close();
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
	},

	rowspan : function(store) {
		var size = store.getCount();
		for (var i = 0; i < size; i++) {
			temp001 = storeTemp.getAt(tempi).get('temp01');
			temp002 = storeTemp.getAt(tempi).get('temp02');

											
			var applyName001 = storeTemp.getAt(tempi).get('createBy'); 
			for (m; m < temp01; m++) {
				html = html + tFE;
			}
			/*
			 * for (var j = temp01; j < temp02; j++) { //用于填充对应时间内所有的格子 html =
			 * html + tdFirst + applyName + tdEnd; }
			 */
			var changeFirst = '<td  height="45" ';
			html = html + changeFirst + " colspan=" + (temp02 - temp01)
					+ "  width=\"" + (temp02 - temp01) * 15 + "\""
					+ " bgcolor=\"#FF0000\ >" + applyName001+ tdEnd;
			colorNum = colorNum + (temp02 - temp01);
			m = temp02;
			justFor = temp02;
		}
	}

});
