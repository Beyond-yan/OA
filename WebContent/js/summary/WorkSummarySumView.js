/**
 * @author:
 * @class WorkSummarySumView
 * @extends Ext.Panel
 * @description [WorkSummarySum]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
WorkSummarySumView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		WorkSummarySumView.superclass.constructor.call(this, {
			id : 'WorkSummarySumView',
			title : '工作总结汇总管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		var yearno = new Ext.form.DateField(
				{
					fieldLabel : '年度:',
					id : 'WSSVwyearno',
					flex : 1,
					xtype : 'datefield',
					format:'Y',
					width:180
				}		
		);
		
		yearno.on('select',function(comboBox){
			
			Ext.getCmp('WSSVwqyearno').setValue(new Date(Ext.getCmp('WSSVwyearno').getValue()).getFullYear());
		});			
		
		var comboType = new Ext.form.ComboBox(
				{
					fieldLabel : '总结类型:',
					hiddenName : 'Q_type_S_EQ',
					id:'WSSVwcombotype',
					editable : false,
					triggerAction : 'all',
					store : [ '周', '月', '季', '年' ],
					maxLength : 10,
					anchor:'30%'
				}		
		);

		var storeTypeNo = new Ext.data.SimpleStore({fields:['value','text'],data:[]});
		
		var comboTypeNo = new Ext.form.ComboBox(
					{
						fieldLabel : '总结类型周期数',
						hiddenName : 'Q_typeNo_N_EQ',
						id:'WSSVwcombotypeno',
						editable : false,
						mode:'local',
						value:'请先选择总结类型',
						triggerAction : 'all',
						valueField:'value',
						displayField: 'text',
						store : storeTypeNo,
						anchor:'30%'
					}	
		);
		comboType.on('select',function(comboBox){				
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
			comboTypeNo.setValue('1');
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
			fieldLabel : '年度:',
			store : yearnoStore,
			id : 'WSSVwqyearno_id',
			editable : false,
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			mode : 'local',
			listeners: {'select':function(){
				Ext.getCmp('WSSVwqyearno').setValue(Ext.getCmp('WSSVwqyearno_id').getValue());
				}
			}
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
		var sm = new Ext.grid.CheckboxSelectionModel({
	        listeners:{
	            // prevent selection of records with invalid descriptions
	            beforerowselect: function(selModel, rowIndex, keepExisting, record) {					
					if ((record.get('isAuthorized') != '0')) {	                	
	                    return false;
	                }
	            }
	        }
	    });
				
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '标题',
				name : 'Q_title_S_LK',
				flex : 1,
				width : 250,
				xtype : 'textfield'
			},
			
			yearnoSelect,
			{
				name : 'Q_yearNo_N_EQ',
				id :'WSSVwqyearno',
				flex : 1,
				width : 200,
				xtype : 'hidden'
			},
			comboType,
			comboTypeNo ],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'WorkSummarySumGrid',
			//			url : __ctxPath + "/summary/listWorkSummarySum.do",
			   url : __ctxPath + "/summary/listWorkSummarySum.do", 
			   root : 'result',
				fields : [ {
					name : 'sumid',
					type : 'int'
				}, 'title', 'type', 'year', 'typeNo', 'sumcontent',
						'createUserid', 'createDate', 'lasteditUserid',
						'lasteditDate','yearNo','isAuthorized' ],
			columns : [ {
				header : 'sumid',
				dataIndex : 'sumid',
				hidden : true
			}, {
				header : '标题',
				dataIndex : 'title'

			},
			{
				header : '审核状态',
				dataIndex : 'isAuthorized',
				renderer:function(value){
					if(value=='1'){
					   return '<a style="color:green;">已审核</a>';
					}
					if(value=='0'){
					   return '<a style="color:red;">未审核</a>';
					}
				}
			}, 
			{
				header : '年度',
				dataIndex : 'yearNo'
			}, {
				header : '总结类型',
				dataIndex : 'type'
			}, {
				header : '总结类型周期数',
				dataIndex : 'typeNo'
			},{
				header : '类型数目',
				dataIndex : 'typeNo'
			}, {
				header : 'createUserid',
				dataIndex : 'createUserid',
				hidden : true
			}, {
				header : 'createDate',
				dataIndex : 'createDate',
				hidden : true
			}, {
				header : 'lasteditUserid',
				dataIndex : 'lasteditUserid',
				hidden : true
			}, {
				header : 'lasteditDate',
				dataIndex : 'lasteditDate',
				hidden : true
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px',
					hideIndex:'isAuthorized'
				}, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px',
					hideIndex:'isAuthorized'
				},
				{
					iconCls : 'btn-detail',
					qtip : '详细信息',
					style : 'margin:0 3px 0 3px'
				}  ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ],
			sm:sm
		// end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new WorkSummarySumFormRO( {
				sumid : rec.data.sumid
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new WorkSummarySumForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/summary/multiDelWorkSummarySum.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/summary/multiDelWorkSummarySum.do',
			grid : this.gridPanel,
			idName : 'sumid'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new WorkSummarySumForm( {
			sumid : record.data.sumid
		}).show();
	},
	detailRs:function(record){
		new WorkSummarySumFormRO({
			sumid : record.data.sumid
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.sumid);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-detail':
			this.detailRs.call(this,record);
			break;			
		default:
			break;
		}
	}
});
