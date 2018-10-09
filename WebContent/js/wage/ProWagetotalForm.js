/**
 * @author
 * @createtime
 * @class ProWagetotalForm
 * @extends Ext.Window
 * @description 工资表单
 * @company 捷达世软件
 */
ProWagetotalForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProWagetotalForm.superclass.constructor.call(this, {
			id : 'ProWagetotalFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '工资明细信息',
			buttonAlign : 'center'

		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		
		 this.store = new Ext.data.Store( {
				proxy : new Ext.data.HttpProxy( {
					url : __ctxPath + '/wage/showProWagedetails.do?wtotalId='+this.id
				}),
				reader : new Ext.data.JsonReader( {
					root : 'result',
					totalProperty : 'totalCounts',
					id : 'CarDetailGrid',
					fields : [
					         {
					        	  name : 'name',
					        	  mapping : 'proWageconfig.name'
					          },  'value', 'wageconfigId', 'wageDate', 'isdel',
					          'createDate', 'createBy', 'updateDate', 'updateBy', 'year',
					          'month' ]
				}),
				remoteSort : true
			});
		 this.store.reload( {
				params : {
					start : 0,
					limit : 25
				}
			});

			var sm = new Ext.grid.CheckboxSelectionModel();
		 
			var cm = new Ext.grid.ColumnModel(
					{
						columns : [
								new Ext.grid.RowNumberer(),
								{
									header : '项目名称',
									dataIndex : 'name'	
								},
								{
									header : '金额',
									dataIndex : 'value'
								}
								 ],
						defaults : {
							sortable : true,
							menuDisabled : false,
							width : 100
						}
					}	
			);
			this.topbar = new Ext.Toolbar({
				id : 'BoardrooFormtopBar',
				height : 30,
				bodyStyle : 'text-align:right',
				menuAlign : 'center',
				items : []
			});
			this.gridPanel = new Ext.grid.GridPanel( {
				id : 'CarGrid',
				region : 'center',
//				tbar : this.topbar,
				store : this.store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				frame : true,
					//autoHeight : true,
				clicksToEdit:1,
				 stripeRows:true,
				height : 400,
				cm : cm,
				sm : sm,
					// plugins : this.rowActions,
				viewConfig : {
						forceFit : true,
						autoFill : true
					}
			});
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'ProWagetotalForm',
			defaults : {
				anchor : '96%,96%'
			},
//			defaultType : 'textfield',
			items : [this.gridPanel]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			
			this.formPanel.loadData( {
				url : __ctxPath + '/wage/getProWagetotal.do?id=' + this.id,
				root : 'data',
				preName : 'proWagetotal'
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
		$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/wage/saveProWagetotal.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('ProWagetotalGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});