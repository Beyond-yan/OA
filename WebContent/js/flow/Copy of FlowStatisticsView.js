/**
 * 
 * @class FlowStatisticsView
 * @extends Ext.Panel
 * @description 流程统计报表
 * 
 */
// 日期计算函数

// 日期计算函数-结束
var today = new Date();
var nextday = new Date();
nextday.setDate(today.getDate() + 7);
var mealTypeStore = new Ext.data.JsonStore( {
	url : __ctxPath
			+ "/diningMgnt/listallDiningMealtype.do",
	method : 'post',
	root : 'result',
	totalProperty : 'totalCounts',
	remoteSort : true,					
	fields : [ {
		name : 'id',
		type : 'int'
	}, 'typename' ],
	autoLoad : true,
	sortInfo : {
		field : 'id',
		direction : 'ASC'
	}
// 关键代码 默认排序项name
});

var foodTypeStore = new Ext.data.JsonStore({

	url : __ctxPath
			+ "/diningMgnt/listcommonDiningFoodtype.do",
	method : 'post',
	root : 'result',
	totalProperty : 'totalCounts',
	remoteSort : true,					
	fields : [ {
		name : 'id',
		type : 'int'
	}, 'foodtypename','diningMealtype.id','price' ],
	autoLoad : false,
	sortInfo : {
		field : 'foodtypename',
		direction : 'ASC'
	}
// 关键代码 默认排序项name

});

var droomStore = new Ext.data.JsonStore({

	url : __ctxPath
			+ "/diningMgnt/getDiningRoomListDiningBooking.do",
	method : 'post',
	root : 'result',
	totalProperty : 'totalCounts',
	remoteSort : true,					
	fields : [ {
		name : 'id',
		type : 'int'
	}, 'configkey','configname','datavalue'],
	autoLoad : true,
	sortInfo : {
		field : 'datavalue',
		direction : 'ASC'
	}
// 关键代码 默认排序项name

});

function getDateStr(datestr){
	var strdate = datestr.split("-");
	var dateEx = new Date(strdate[0],strdate[1],strdate[2]);
	return dateEx;
}


FlowStatisticsView = Ext
		.extend(
				Ext.Panel,
				{
					store : null,
					picPanel : null,
					searchPanel : null,
					mealTypeStore: null,
					foodTypeStore:null,
					droomStore:null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						FlowStatisticsView.superclass.constructor.call(this,
								{
									id : 'FlowStatisticsView',
									title : '流程统计报表',
									region : 'center',
									layout : 'border',
									items : [ this.searchPanel, this.picPanel ]
								});
					},// end of constructor
					// 初始化组件
					initUIComponents : function() {

						// 初始化搜索条件Panel
						this.searchPanel = new HT.SearchPanel( {
							layout : 'form',
							region : 'north',
							items : [{
			                    xtype : 'container',
			                    style : 'padding-left:0px;margin-bottom:4px;',
			                    layout : 'column',
			                    items : [{
			                        xtype : 'label',
			                        text : '开始日期:',
			                        style : 'padding-left:50px;',
			                        width : 140
			                        },
			                        {
			                        fieldLabel:'开始日期',
			                        name : 'employeeCode',
			                        id: 'employeeCode_id',
			                        xtype : 'textfield',
			                        width:125,
			                        readOnly:true
			                        },{
			                        xtype : 'label',
			                        text : '结束日期:',
			                        style : 'padding-left:85px;',
			                        width : 165
			                        },
			                        {
			                        fieldLabel:'结束日期',
			                        name : 'deptName',
			                        id: 'deptName_id',
			                        xtype : 'textfield',
			                        width:125,
			                        readOnly:true
			                        }]
			                    },{
				                    xtype : 'container',
				                    style : 'padding-left:0px;margin-bottom:4px;',
				                    layout : 'column',
				                    items : [{
				                        xtype : 'label',
				                        text : '会签部门:',
				                        style : 'padding-left:50px;',
				                        width : 140
				                        }, {
										xtype : 'textarea',
										name : 'archives.recDepNames',
										width : '60%',
										height: 60,
										readOnly : true,
										allowBlank : false,
										id : 'FileHuiQian_Flow.archivesFlow.recDepNames'
									}, {
										xtype : 'hidden',
										name : 'archives.recDepIds',
										id : 'FileHuiQian_Flow.archivesFlow.recDepIds'
									}, {
										xtype : 'button',
										iconCls : 'menu-department',
										text : '选择部门',
										handler : function() {
											var depIdsTemp=Ext.getCmp('FileHuiQian_Flow.archivesFlow.recDepIds').getValue();
											var depNamesTemp=Ext.getCmp('FileHuiQian_Flow.archivesFlow.recDepNames').getValue();
											var array1=[];
											var array2=[];
											
											var m = new Map();
											if(depIdsTemp!=null && depIdsTemp!=''){
												array1 = depIdsTemp.split(',');
												array2 = depNamesTemp.split(',');
												for(var i=0;i<array1.length;i++){
													m.put(array1[i],array2[i]);
												}
											}
											
											DepSelector3.getView(
													function(depIds, depNames) {
														Ext.getCmp('FileHuiQian_Flow.archivesFlow.recDepIds').setValue(depIds);
														Ext.getCmp('FileHuiQian_Flow.archivesFlow.recDepNames').setValue(depNames);
													}, false,m).show();
										}
									}]
				                    }],
							buttons : [ {
								iconCls : 'search',
								text : '查询',
								handler : this.search.createCallback(this)
							}, {
								iconCls : 'btn-reset',
								// style : 'padding-right:40%;',
								text : '重置',
								handler : this.reset.createCallback(this)
							}]
						});// end of searchPanel



															

						this.store = new Ext.data.JsonStore( {
							url : __ctxPath + '/diningMgnt/getmenulistDiningMenu.do',
//									+ 'Q_menudate_D_GE=' + today//new Date(Ext.getCmp('DiningMenuBrsstartdate').getValue())
//									+ '&Q_menudate_D_LE=' + nextday,//new Date(Ext.getCmp('DiningMenuBrsenddate').getValue()),
							method : 'post',
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							autoLoad : false,					
							fields : [ {
								name : 'id',
								type : 'int'
							}, 'menudate', 'diningMealtype.typename',
									'foodname',
									'price', 'createuserid', 'createdate',
									'lastedituserid', 'lasteditdate',
									'unitname','diningroom' ],
							sortInfo : {
								field : 'menudate',
								direction : 'ASC'
							}
						});
						this.store.on("load", function(store, record, opts) {
								
								html = getHtml(store);								
								var fm = Ext.getCmp('picPanel');
								fm.update(html);

							});
						


						this.picPanel = new Ext.Panel( {
							height : 500,
							id : 'picPanel',
							region : 'center',
							// store : this.store,
							html : '',
							autoScroll : true
						});
						
						function right(mainStr,lngLen) { 
							// alert(mainStr.length) 
							if (mainStr.length-lngLen>=0 && mainStr.length>=0 && mainStr.length-lngLen<=mainStr.length) { 
							return mainStr.substring(mainStr.length-lngLen,mainStr.length)} 
							else{return null;} 
							}; 						

						function getHtml(store) {
							
							var html = "<table cellspacing='1' border='0' bgcolor='#000000'>";
							var htmltd = "";
							var startdate = new Date(Ext.getCmp('DiningMenuBrsstartdate')
									.getValue());
							var enddate = new Date(Ext.getCmp('DiningMenuBrsenddate')
									.getValue());
							var mealcount = 0;
							var mealtypecount = 0;
							var drtypecount = 0;
							var droomcount = 0;
							while (enddate - startdate >= 0) 
							{
								drtypecount = 0;
								for (droomcount = 0;droomcount<droomStore.getTotalCount();droomcount++){

									mealtypecount = 0;
									for (mealcount = 0; mealcount < mealTypeStore.getTotalCount(); mealcount++) 
									{									
										var menucontent = "";
										html += "<tr bgcolor='#FFFFFF'>";
										if (drtypecount == 0 ) {
											var strdate = startdate.getFullYear()
													+ "-"
													+ right("0"+(startdate.getMonth() + 1),2)
													+ "-" + right("0"+startdate.getDate(),2);
											html += "<td rowspan='~drtypecount' width='20%'>" + strdate + "</td>";											
										}				
										if (mealtypecount == 0 ) {
											html += "<td rowspan='~mealtypecount' width='20%'>" 
												+ droomStore.getAt(droomcount).get("configname") + "</td>";											
										}
										html += "<td width='20%'>"
											+ mealTypeStore.getAt(mealcount).get("typename") + "</td>";			
										menucontent = "";
										for(var i=0;i<store.getTotalCount();i++)
										{

											//alert(store.getAt(i).get("menudate")+"||"+strdate);
											//alert((new Date(store.getAt(i).get("menudate"))) +"-"+ (new Date(strdate))+ "||" +store.getAt(i).get("diningMealtype.typename") +"==" +mealTypeStore.getAt(mealcount).get("typename"));
											if ((getDateStr(store.getAt(i).get("menudate"))) - (getDateStr(strdate))==0 && 
												store.getAt(i).get("diningMealtype.typename") == mealTypeStore.getAt(mealcount).get("typename") &&
												store.getAt(i).get("diningroom") == droomStore.getAt(droomcount).get("configname"))
											{	
												//alert(store.getAt(i).get("diningFoodtype.id") + "||" + foodTypeStore.getAt(k).get("id"));
												menucontent += store.getAt(i).get("foodname")+ "  " + 
																store.getAt(i).get("price")+ "元/" + 
																store.getAt(i).get("unitname")+"<BR>";
												//html +="<td width='30%'>食谱：<BR>"+menucontent+" </td>";
											}
										}	
										html +="<td width='30%'>食谱：<BR>"+menucontent+" </td>";
										html += "</tr>";
										
										mealtypecount ++ ;
										drtypecount ++;
									}										
									html = html.replace("'~mealtypecount'", mealtypecount.toString());
								}

								html = html.replace("'~drtypecount'", drtypecount.toString());
								startdate.setDate(startdate.getDate() + 1);
							}
							html += "</table>";							
							return html;
						};

					},// end of the initComponents()
					search : function(self) {
						if (self.searchPanel.getForm().isValid()) {// 如果合法
						self.store.load({
							params : {
							'Q_menudate_D_GE' : Ext.getCmp('DiningMenuBrsstartdate').getValue(),
							'Q_menudate_D_LE' : Ext.getCmp('DiningMenuBrsenddate').getValue()
							}
						});
						
						}
					},

					
					/**
					 * 清空
					 */
					reset : function(self) {
						self.searchPanel.getForm().reset();
					}
				});