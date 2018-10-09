/**
 * @author
 * @createtime
 * @class OffsupplyApplyOneForm
 * @extends Ext.Window
 * @description OffsupplyApplyOne表单
 * @company 捷达世软件
 */
OffsupplyApplyOneForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		OffsupplyApplyOneForm.superclass.constructor.call(this, {
			id : 'OffsupplyApplyOneFormWin',
			layout : 'form',
			items : [this.formPanel,this.gridPanel],
			modal : true,
			height : 600,
			width : 800,
			maximizable : true,
			title : '办公用品申请详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var time = new Date();    
   		var month="";
   		month = time.getMonth() + 1;
   		
		this.formPanel = new Ext.FormPanel( {
			id:'OffsupplyApplyOneForm',
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'OffsupplyApplyOneForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'offsupplyApplyOne.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '申请人Id',
				name : 'offsupplyApplyOne.applicantId',
				allowBlank : false,
				value:curUserInfo.userId,
				xtype : 'hidden'
			}, {
				fieldLabel : '申请月份',
				name : 'offsupplyApplyOne.applyTime',
				xtype : 'textfield',
				allowBlank : false,
				value:month,
				readOnly : true
				//format : 'Y-m-d'
			},{
				fieldLabel : '总金额',
				id : 'offsupplyApplyOne.feeAmount',
				name : 'offsupplyApplyOne.feeAmount',
				maxLength : 18,
				readOnly : true
			}, {
				fieldLabel : '备注',
				name : 'offsupplyApplyOne.remark',
				xtype : 'textarea',
				maxLength : 400
			}, {
				fieldLabel : '部门ID',
				name : 'offsupplyApplyOne.belongDeptId',
				allowBlank : false,
				value:curUserInfo.depId,
				xtype : 'hidden'
			}/*, {
				fieldLabel : 'CREATE_DATE',
				name : 'offsupplyApplyOne.createDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'CREATE_BY',
				name : 'offsupplyApplyOne.createBy',
				maxLength : 50
			}, {
				fieldLabel : 'UPDATE_DATE',
				name : 'offsupplyApplyOne.updateDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'UPDATE_BY',
				name : 'offsupplyApplyOne.updateBy',
				maxLength : 50
			}*/ ]
		});
		
		// 办公用品明细部分
		var sm = new Ext.grid.CheckboxSelectionModel();
		
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(),
			    {
					header : 'id',
					dataIndex : 'id',
					hidden : true
			    },
			    {
					header : 'EAM系统编号',
					dataIndex : 'eamSysCode',
					hidden : true
				}, {
					header : '类型',
					dataIndex : 'type',
					hidden : true
				}, {
					header : '名称',
					width : 50,
					dataIndex : 'name'
				
				}, {
					header : '单位',
					width : 30,
					dataIndex : 'unit'
				}, {
					header : '单价',
					width : 30,
					dataIndex : 'price'
				},
				{
					header : '数量',
					dataIndex : 'quantity',
					width : 15,
					editor : new Ext.form.NumberField({
						allowBlank : false,
						allowNegative : false,
						nanText : '请输入合法数字！',
						value : 0,
						blur : this.computFeeAmount
					})
				},
				{
					header : '合计',
					dataIndex : 'feeAmount',
					width : 30,
					value : 0
				}
			],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
		
		// Grid内容部分
		this.store = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + "/admin/list2OffsupplyInfo.do"
			}),
			reader : new Ext.data.JsonReader({
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [ {
					name : 'id',
					type : 'int'
				}, 'eamSysCode', 'type', 'name', 'unit', 'price', 'status',
						'remark',  'createBy',
						'updateBy' ]
			}),
			remoteSort : false
		});
		
		//this.store.setDefaultSort('configKey', 'ASC');
		
		this.store.load();
	
		// 产生Grid部分
		this.gridPanel = new Ext.grid.EditorGridPanel({
			id : 'OffsupplyApplyFormGrid',
			region : 'center',
			store : this.store,
		    trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			clicksToEdit:1,
		    stripeRows:true,
			height : 150,
			cm : cm,
			//sm : sm,
			viewConfig : {
				forceFit : true,
				autoFill : true
			}
		});

		this.gridPanel.addListener('rowdblclick', this.rowClick);
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/admin/getOffsupplyApplyOne.do?id='
						+ this.id,
				root : 'data',
				preName : 'offsupplyApplyOne'
			});
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
		var userId=Ext.getCmp('OffsupplyApplyOneForm').getCmpByName('offsupplyApplyOne.applicantId').getValue();
		var time = new Date();  
		var year="";
   		var month="";
   		year = time.getYear()+1900;
   		month = time.getMonth() + 1;
		var saveFlag = true;
		Ext.Ajax.request({
					url : __ctxPath + "/admin/listOffsupplyApplyOne.do",
					method : 'POST',
					async : false,
					success : function(response, opts) {
						var obj = Ext.decode(response.responseText);

						if (obj.result.length > 0) {
							saveFlag = false;
						}
					},
					failure : function(response, opts) {

						
					},
					params : {
						'Q_appUser.userId_L_EQ' : userId,
						'offsupplyApplyOne.year' : year,
						'offsupplyApplyOne.applyTime' : month
						
					}
				});

		if (!saveFlag) {
			Ext.MessageBox.alert('警告','该月办公用品已经申请，不能重复申请！',function(btn){
				
			});
			return;
		}
		
		// 取得费用明细(GridPanel)中的值
		var details = [];
		var gridPanel = Ext.getCmp('OffsupplyApplyFormGrid');
		var totalMoney=0;
		if(gridPanel != null) {
			var store = gridPanel.getStore();
			for (var i = 0; i < store.getCount(); i++) {
				
				// 合计 = 费用标准 x 人数 x 天数
				//store.getAt(i).data.feeAmount = (store.getAt(i).get('feeStandard')) * (store.getAt(i).get('peopleAmount')) * (store.getAt(i).get('dayAmount'));
				totalMoney+=store.getAt(i).get('feeAmount');
				details.push(store.getAt(i).data);
			}
		}
		Ext.getCmp('offsupplyApplyOne.feeAmount').setValue(totalMoney);
		if(totalMoney>20){
			Ext.MessageBox.alert('警告','费用总和不能超过人均20元',function(btn){
				
			});
		}
		//alert(totalMzzoney);
		// 执行表单提交操作
		if (this.formPanel.getForm().isValid()) {
			this.formPanel.getForm().submit({
				scope : this,
				url : __ctxPath + '/admin/saveOffsupplyApplyOne.do',
				params : {
					details : Ext.encode(details)
				},
				method : 'post',
				waitMsg : '数据正在提交，请稍后...',
				success : function(fp, action) {
					var gridPanel = Ext.getCmp('OffsupplyApplyOneGrid');
					if (gridPanel != null) {
						gridPanel.getStore().reload();
					}
					this.close();
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
						title : '操作信息',
						msg : '信息保存出错，请联系管理员！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
				}
			});
		}
		/*$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/admin/saveOffsupplyApplyOne.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('OffsupplyApplyOneGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});*/
	},// end of save
	// 自动计算费用合计
	computFeeAmount : function() {
		var gridPanel = Ext.getCmp('OffsupplyApplyFormGrid');
		if(gridPanel != null) {
			var store = gridPanel.getStore();
			for (var i = 0; i < store.getCount(); i++) {
				if(store.getAt(i).get('quantity') != null) {
					store.getAt(i).set('feeAmount', ((store.getAt(i).get('price')) * (store.getAt(i).get('quantity'))));
				}
			}
		}
	}

});