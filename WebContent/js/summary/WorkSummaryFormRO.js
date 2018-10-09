/**
 * @author
 * @createtime
 * @class WorkSummaryFormRO
 * @extends Ext.Window
 * @description WorkSummary表单
 * @company 捷达世软件
 */

WorkSummaryFormRO = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		WorkSummaryFormRO.superclass.constructor.call(this, {
			id : 'WorkSummaryFormROWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 500,
			width : 850,
			maximizable : true,
			title : '工作汇总详细信息',
			buttonAlign : 'center',
			buttons : [{
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var comboSType = new Ext.form.ComboBox( {
			fieldLabel : '总结类型',
			hiddenName : 'workSummary.summarytype',
			allowBlank : false,
			editable : false,
			disabled:true,
			triggerAction : 'all',
			store : [ '周', '月', '季', '年' ],
			maxLength : 10,
			anchor : '30%'
		});
		
		var storeTypeNo = new Ext.data.SimpleStore({fields:['value','text'],data:[]});

		var comboSTypeNo = new Ext.form.ComboBox(
					{
						fieldLabel : '总结类型周期数',
						hiddenName : 'workSummary.typeNo',
						allowBlank : false,
						editable : false,
						disabled:true,
						mode:'local',
						triggerAction : 'all',
						valueField:'value',
						displayField: 'text',
						store : storeTypeNo,
						anchor:'30%'
					}	
		);
		
		comboSType.on('select',function(comboBox){				
			var typevalue = comboBox.getValue();
			
			if (typevalue == '年')
			{
				storeTypeNo.loadData(listYear);		
			}
			else if (typevalue == '季')
			{
				//alert(typevalue);
				//alert(listSeasons);
				storeTypeNo.loadData(listSeasons);		
			}
			else if (typevalue == '月')
			{
				storeTypeNo.loadData(listMonths);	
			}
			else if (typevalue == '周')
			{
				storeTypeNo.loadData(listWeeks);		
			}
			comboSTypeNo.setValue('1');
		});		
		
		var listYear = [['1','1']];
		var listSeasons = [['1','1'],['2','2'],['3','3'],['4','4']];
		var listMonths = [['1','1'],['2','2'],['3','3'],['4','4'],['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],['10','10'],['11','11'],['12','12']];
		var listWeeks =  [['1','1'],['2','2'],['3','3'],['4','4'],['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],['10','10'],
		                  ['11','11'],['12','12'],['13','13'],['14','14'],['15','15'],['16','16'],['17','17'],['18','18'],['19','19'],['20','20'],
		                  ['21','21'],['22','22'],['23','23'],['24','24'],['25','25'],['26','26'],['27','27'],['28','28'],['29','29'],['30','30'],
		                  ['31','31'],['32','32'],['33','33'],['34','34'],['35','35'],['36','36'],['37','37'],['38','38'],['39','39'],['40','40'],
		                  ['41','41'],['42','42'],['43','43'],['44','44'],['45','45'],['46','46'],['47','47'],['48','48'],['49','49'],['50','50'],
		                  ['51','51'],['52','52'],['53','53']
		                  ];
		var yearnoStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : []
		});
		var yearnoSelect=new Ext.form.ComboBox({
			fieldLabel : '年度',
			store : yearnoStore,
			name:'workSummary.yearNo',
			editable : false,
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			mode : 'local'
		});
		//初始化年份
		Ext.Ajax.request({
			url : __ctxPath + "/summary/searchYearWorkSummary.do",
			success : function(response, options) {
				 var data = response.responseText;
		         data = eval("("+ data + ")");
		         nowYear=data.year;
		         var yearList="";
		         for(var i=nowYear-10;i<nowYear+1;i++){
		        	 yearList+=",['"+i+"','"+i+"']";
		         }
		         yearList=yearList.substring(1);
		         yearList="["+yearList+"]";
		         yearList=eval(yearList);
		         yearnoStore.loadData(yearList);
			},
			failure : function(response) {
				Ext.Msg.alert("提示", "初始化失败！");
			}
		});
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'WorkSummaryFormRO',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
					{
						name : 'workSummary.summaryid',
						xtype : 'hidden',
						value : this.summaryid == null ? '' : this.summaryid
					},
					{
						fieldLabel : '所属部门',
						id : 'WSFrmROdepartmentcombo',
						hiddenName : 'workSummary.deptid',
						flex : 1,
						width : 200,
						xtype : 'combo',
						editable : false,
						allowBlank : false,
						disabled:true,
						triggerAction : 'all',
						displayField : 'depname',
						valueField : 'depid',
						mode : 'local',
						store : new Ext.data.SimpleStore( {
							autoLoad : true,
							url : __ctxPath + '/system/comboDep3Department.do',
							fields : [ 'depid', 'depname' ],
							listeners : {
								load : function() {
										Ext.getCmp('WSFrmROdepartmentcombo')
											.setValue(curUserInfo.depId);
								}
							}
						})
					}, {
						fieldLabel : '总结日期',
						name : 'workSummary.summarydate',
						allowBlank : false,
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date(),
						disabled:true
					},
					yearnoSelect,	
					comboSType,
					comboSTypeNo,
					{
						fieldLabel : '总结标题',
						name : 'workSummary.title',
						allowBlank : false,
						maxLength : 100,
						disabled:true
					}, {
						fieldLabel : '工作完成状况',
						name : 'workSummary.completestate',
						xtype : 'fckeditor',
						height : 180,
						width : 670,
						allowBlank : true,
						editable:false
					}, {
						fieldLabel : '部门工作概况',
						name : 'workSummary.deptstate',
						xtype : 'fckeditor',
						height : 180,
						width : 670,
						allowBlank : true,
						editable:false
					}, {
						fieldLabel : '存在工作难点',
						name : 'workSummary.trouble',
						xtype : 'fckeditor',
						height : 180,
						width : 670,
						allowBlank : true,
						editable:false
					}, {
						fieldLabel : '不足分析和改善措施',
						name : 'workSummary.jobanalysis',
						xtype : 'fckeditor',
						height : 180,
						width : 670,
						allowBlank : true,
						editable:false
					}, {
						fieldLabel : '下(月)工作计划',
						name : 'workSummary.jobplan',
						xtype : 'fckeditor',
						height : 180,
						width : 670,
						allowBlank : true,
						editable:false
					}, {
						fieldLabel : '备注',
						name : 'workSummary.comment',
						xtype : 'fckeditor',
						height : 180,
						width : 670,
						allowBlank : true,
						editable:false
					} ]
		});
		// 加载表单对应的数据
		if (this.summaryid != null && this.summaryid != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/summary/getWorkSummary.do?summaryid='
						+ this.summaryid,
				root : 'data',
				preName : 'workSummary'
			});

			Ext.getCmp('WSFrmROdepartmentcombo').setValue('1');
		}

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() {
		$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/summary/saveWorkSummary.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('WorkSummaryGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});