CostStatisticsView = Ext.extend(Ext.Panel, {
	store : null,
	picPanel : null,
	searchPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CostStatisticsView.superclass.constructor.call(this, {
					id : 'CostStatisticsView',
					title : '费用统计',
					region : 'center',
					iconCls:"menu-flowWait",
					layout : 'border',
					items : [this.searchPanel, this.picPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
      var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 2000;
		var arr = [];
		for (var i = 0; i <= startYear; i++) {
			arr[i] = 2001 + i;
		}
		this.radio = new Ext.form.RadioGroup({
					id : 'costStatisticsRadio',
					layout : 'form',
					// style : 'padding-left:20px;margin-bottom:4px;',
					items : [{
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								layout : 'column',
								items : [{
											boxLabel : '按月统计',
											id : 'selectByM',
											name : 'sele',
											checked : true
										}, {
											boxLabel : '按年统计',
											name : 'sele',
											id : 'selectByY',
											style : 'margin-left:50px;'
										}, {
											boxLabel : '按时段统计',
											name : 'sele',
											id : 'selectByT',
											style : 'margin-left:50px;'
										}]
							}],
					listeners : {
						'change' : function() {
							if ((Ext.getCmp('selectByM').getValue() == true)) {
								Ext.getCmp('TJTime').setVisible(true);
								Ext.getCmp('costStatisticsStartDate').setVisible(true);
								Ext.getCmp('endDateLabel').setVisible(false);
								Ext.getCmp('costStatisticsEndDate')
										.setVisible(false);
								Ext.getCmp('selectBy').setValue('M');
								Ext.getCmp('costStatisticsStartDate').reset();
								Ext.getCmp('costStatisticsEndDate').reset();
								
								Ext.getCmp('carcostByYear').setVisible(false);
								Ext.getCmp('carcostByYearStart').setVisible(false);
								//Ext.getCmp('carcostByYearBS').setVisible(false);
								//Ext.getCmp('carcostByYearEnd').setVisible(false);
							} else if ((Ext.getCmp('selectByY').getValue() == true)) {
								Ext.getCmp('TJTime').setVisible(false);
								Ext.getCmp('costStatisticsStartDate').setVisible(false);
								Ext.getCmp('endDateLabel').setVisible(false);
								Ext.getCmp('costStatisticsEndDate')
										.setVisible(false);
								Ext.getCmp('selectBy').setValue('Y');
								Ext.getCmp('carcostByYearStart').reset();
								//Ext.getCmp('carcostByYearEnd').reset();
								
								Ext.getCmp('carcostByYear').setVisible(true);
								Ext.getCmp('carcostByYearStart').setVisible(true);
								//Ext.getCmp('carcostByYearBS').setVisible(true);
								//Ext.getCmp('carcostByYearEnd').setVisible(true);
							} else {
								Ext.getCmp('TJTime').setVisible(true);
								Ext.getCmp('costStatisticsStartDate').setVisible(true);
								Ext.getCmp('endDateLabel').setVisible(true);
								Ext.getCmp('costStatisticsEndDate')
										.setVisible(true);
								Ext.getCmp('selectBy').setValue('T');
								Ext.getCmp('costStatisticsStartDate').reset();
								Ext.getCmp('costStatisticsEndDate').reset();
								
								Ext.getCmp('carcostByYear').setVisible(false);
								Ext.getCmp('carcostByYearStart').setVisible(false);
								//Ext.getCmp('carcostByYearBS').setVisible(false);
								//Ext.getCmp('carcostByYearEnd').setVisible(false);
							}

						}
					}

				})
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			items : [{
						xtype : 'container',
						style : 'padding-left:50px;margin-bottom:4px;',
						layout : 'fit',
						items : [this.radio]
					}, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						layout : 'column',
						items : [{
									xtype : 'textfield',
									id : 'selectBy',
									value : 'M',
									hidden : true
								}, {
									id:'TJTime',
									xtype : 'label',
									text : '统计时间:',
									editable:false,
									style : 'padding-left:50px;',
									width : 140
								}, {
									name : 'startDate',
									id : 'costStatisticsStartDate',
									xtype : 'datefield',
									editable:false,
									format : 'Y-m-d',
									anchor : '98%'/*
													 * , value : new Date()
													 */
								}, {
									xtype : 'label',
									hidden : 'true',
									text : '结束时间:',
									id : 'endDateLabel',
									style : 'padding-left:85px;',
									width : 165
								}, {
									name : 'endDate',
									hidden : 'true',
									editable : false,
									id : 'costStatisticsEndDate',
									xtype : 'datefield',
									format : 'Y-m-d',
									anchor : '98%'/*
													 * , value : new Date()
													 */
								}, {
									xtype : 'hidden',
									id : 'carids',
									name : 'carids'
								}, {
									id:'carcostByYear',
									xtype : 'label',
									text : '年份:',
									hidden:true,
									editable:false,
									style : 'padding-left:50px;',
									width : 140
								},{
							    id:'carcostByYearStart',
								hidden:true,
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : arr,
								listeners : {
									change : function() {
										Ext.getCmp('costStatisticsStartDate').setValue((this.getValue() + '-01-01'));
										Ext.getCmp('costStatisticsEndDate').setValue((this.getValue() + '-12-31'));
									}
								}
							},   {									
										xtype : 'textarea',
										name : 'carnos',
										id : 'carnos',
										allowBlank : true,
										readOnly : true,
										height : 23,
										width : '20%',
										style : 'margin-left:30px;margin-bottom:4px;'
								}, {
									xtype : 'button',
									iconCls : 'btn-car',
									text : '选择车辆',
									handler : function() {
										CarAllSelector.getView(
												function(ids, names) {
													Ext.getCmp('carnos')
															.setValue(names);
													Ext.getCmp('carids')
															.setValue(ids);
												}, false).show();
									}
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
						//iconCls : 'btn-reset',
						// style : 'padding-right:40%;',
						text : '打印',
						listeners:{
						   click : this.print.createCallback(this)
						}
					}]
		});// end of searchPanel

		/*
		 * this.radio.addListener('change',function(){
		 * alert(Ext.getCmp('costStatisticsRadio').getForm().getValues(true));Ext.getCmp('costStatisticsRadio').getForm().getValues(true); })
		 */
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + '/admin/costStatisticsCarCostRecord.do',
					method : 'post',
					root : 'result',
					remoteSort : true,
					autoLoad : false,
					fields : ['costComment', 'typeName', 'itemQty',
							'createUser', 'totalAmt']
				});
		this.store.on("load", function(store, record, opts) {
					html = getHtml(store);
					var fm = Ext.getCmp('CostStatisticsPanel');
					fm.update(html);

				});

		this.picPanel = new Ext.Panel({
					height : 480,
					id : 'CostStatisticsPanel',
					region : 'center',
					autoScroll : true,
					// store : this.store,
					html : '',
					autoScroll : true,
					nocache : true
				});

		function right(mainStr, lngLen) {
			if (mainStr.length - lngLen >= 0 && mainStr.length >= 0
					&& mainStr.length - lngLen <= mainStr.length) {
				return mainStr.substring(mainStr.length - lngLen,
						mainStr.length)
			} else {
				return null;
			}
		};

		function getHtml(store) {
			var total3 = 0;
			var total2 = 0;
			var m = 0;
			var array = new Array();
			var count = 0;
			var total = 0;
			for (var j = 0; j < store.getTotalCount(); j++) {
				if (store.getAt(0).get('costComment') == store.getAt(j)
						.get('costComment')) {
					count += 1;
				}
			}
			var startDate = null;
            var endDate=null;
			if (Ext.getCmp('selectBy').getValue() == 'M') {
				startDate = Ext.util.Format.date(Ext
								.getCmp('costStatisticsStartDate').getValue(),
						'Y/m');
			} else if (Ext.getCmp('selectBy').getValue() == 'Y') {
				startDate = Ext.util.Format.date(Ext
								.getCmp('costStatisticsStartDate').getValue(),
						'Y');
				 endDate = Ext.util.Format.date(Ext
							.getCmp('costStatisticsEndDate').getValue(),
					'Y');
			} else {
				startDate = Ext.util.Format.date(Ext
								.getCmp('costStatisticsStartDate').getValue(),
						'Y/m/d');
			    endDate = Ext.util.Format.date(Ext
							.getCmp('costStatisticsEndDate').getValue(),
					'Y/m/d');
			}

			
			var staticsDate = Ext.util.Format.date(new Date(), 'Y/m/d');
			var html ="<table id=\'QryTable\' cellspacing='1' border='0' bgcolor='#000000' >";
			html += "<tr bgcolor=\'#ffffe0\' height=\'50\'><td colspan=\'"
					+ (count + 4)
					+ "\' align=\'center\'><h1 style=\'font-size:20px;\'>车辆费用统计</h1></td></tr>";
			html += "<tr bgcolor=\'#ffffe0\' height=\'20\'>"
					+ "<td align=\'center\' colspan=\'"
					+ (count + 4) + "\'>统计时间:" + startDate
			if (Ext.getCmp('selectBy').getValue() == 'T') {
				html += "&nbsp;&nbsp;&nbsp;&nbsp;截止时间:" + endDate
			}
			html += "&nbsp;&nbsp;&nbsp;&nbsp;统计产生时间:" + staticsDate + "</td>"
					+ "</tr>";
			html += "<tr bgcolor=\'#ffffe0\' height=\'40\'>"
					+ "<td width=\'120px\' align=\'center\' nowrap=''><span style='text-decoration:none;color:#0358A3'>车牌号</span></td>"
					+ "<td width=\'90px\' align=\'center\' nowrap=''><span style='text-decoration:none;color:#0358A3'>驾驶员</span></td>"
					+ "<td width=\'80px\' align=\'center\' nowrap=''><span style='text-decoration:none;color:#0358A3'>里程</span></td>"
			for (var i = 0; i < 1; i++) {
				for (var j = 0; j < store.getTotalCount(); j++) {
					if (store.getAt(i).get('costComment') == store.getAt(j)
							.get('costComment')) {
						html += "<td width=\'80px\' align=\'center\' nowrap=''>"
						+"<span style='text-decoration:none;color:#0358A3'>" 
								+ store.getAt(j).get('typeName') + "</span></td>";
					}
				}
				html += "<td width=\'100px\' align=\'center\'>合计</td></tr>";
			}
			for (var i = 0; i < (store.getTotalCount() / count); i++) {
				m = 0;
				if (i % 2 == 0) {
					html += "<tr bgcolor=\'#FFFFFF\' height=\'20\'>";
				} else {
					html += "<tr bgcolor=\'#B1CDCC\' height=\'20\'>";
				}
				html += "<td  align=\'center\'>"
				        +"<span style='text-decoration:none;color:#0358A3'>" 
						+ store.getAt(i).get('costComment') + "</span></td>"
						+ "<td  align=\'center\'>"
						+ store.getAt(i).get('createUser') + "</td>"
						+ "<td  align=\'center\'>"
						+ Ext.util.Format.number(store.getAt(i).get('itemQty'),'0.00') + "</td>"
				total2 += store.getAt(i).get('itemQty');
				for (var j = 0; j < store.getTotalCount(); j++) {

					if (store.getAt(i).get('costComment') == store.getAt(j)
							.get('costComment')) {
						html += "<td  align=\'center\' >"
								+ Ext.util.Format.number(store.getAt(j).get('totalAmt'),'0.00') + "</td>"
						total += store.getAt(j).get('totalAmt');
						if (i == 0) {
							array[m] = 0;
						}
						array[m] += store.getAt(j).get('totalAmt');
						// alert(m);
						m += 1;
					}

				}
				html += "<td  align=\'center\'>" + Ext.util.Format.number(total,'0.00')
						+ "</td></tr>"
				total3 += total;
				total = 0;

			}

			html += "<tr bgcolor=\'#ffffe0\' height=\'20px\'>"
					+ "<td  align=\'center\'><span style='text-decoration:none;color:red'>总计</span></td>"
					+ "<td  align=\'center\'> </td>"
					+ "<td  align=\'center\'>" + Ext.util.Format.number(total2,'0.00') + "</td>"
			for (var i = 0; i < m; i++) {
				html += "<td  align=\'center\'>" + Ext.util.Format.number(array[i],'0.00')
						+ "</td>"
			}
			html += "<td  align=\'center\'>" + Ext.util.Format.number(total3,'0.00')
					+ "</td></tr>";
			html += "</table>";
			html += "<BR>";
			html += "<BR>";
			html += "<BR>";
			html += "<BR>";
			html += "<BR>";

			return html;
		};

	},// end of the initComponents()
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			/*var s=Ext.getCmp('costStatisticsStartDate').getValue();
			var e=Ext.getCmp('costStatisticsEndDate').getValue();
			if(s!=''&&e!=''){
			  if(s>e){
			  Ext.MessageBox.show({
							title : '操作信息',
							msg : '统计时间应小于结束时间！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
				return;
			  }
			}*/

			var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : '正在提交处理，请稍等！',
				removeMask : true
					// 完成后移除
				});
			myMask.show();
			self.store.load({
						params : {
							'startDate' : Ext.getCmp('costStatisticsStartDate')
									.getValue(),
							'endDate' : Ext.getCmp('costStatisticsEndDate')
									.getValue(),
							'selectBy' : Ext.getCmp('selectBy').getValue(),
							'carIds' : Ext.getCmp('carids').getValue()

						},
						callback : function(store, record, opts) {
							myMask.hide();
						}
					});

		}
	},

	/**
	 * 清空
	 */
	reset : function(self) {
		self.searchPanel.getForm().reset();
		Ext.getCmp('selectBy').setValue('M');

	},
	print:function(self){
     var count=self.store.getCount();
     if(count>0){
	window.open(__ctxPath+ '/pages/carCost/carCostPrint.jsp?&startDate='
							+ (Ext.getCmp('costStatisticsStartDate').getValue()==''?'':Ext.util.Format.date(Ext.getCmp('costStatisticsStartDate').getValue(),'Y-m-d H:m:s'))
							+ '&endDate='+ (Ext.getCmp('costStatisticsEndDate').getValue()==''?'':Ext.util.Format.date(Ext.getCmp('costStatisticsEndDate').getValue(),'Y-m-d H:m:s'))
							+ '&selectBy='+ Ext.getCmp('selectBy').getValue()
							+ '&carIds='+ Ext.getCmp('carids').getValue(),'_blank');
     }else{
       Ext.Msg.alert("提示","没有数据需要打印！")
     }			
	}
	

});
