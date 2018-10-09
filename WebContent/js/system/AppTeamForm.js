/**
 * @author
 * @createtime
 * @class AppTeamForm
 * @extends Ext.Window
 * @description AppTeam表单
 * @company 宏天软件
 */
AppTeamForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		AppTeamForm.superclass.constructor.call(this, {
			id : 'AppTeamFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 150,
			width : 500,
			maximizable : true,
			title : '工作组详细信息',
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
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'AppTeamForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'appTeam.teamId',
				xtype : 'hidden',
				value : this.teamId == null ? '' : this.teamId
			}, {
				fieldLabel : '群组名称',
				name : 'appTeam.teamName',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '群组描述',
				name : 'appTeam.teamDesc',
				maxLength : 200
			}/*, {
				fieldLabel : '群组描述',
				name : 'appTeam.createTime',
				xtype : 'datetimefield',
				format : 'Y-m-d H:i', 
				value : new Date() 
			}*/]
		});
		// 加载表单对应的数据
		if (this.teamId != null && this.teamId != 'undefined') {
			this.formPanel
					.loadData( {
						url : __ctxPath + '/system/getAppTeam.do?teamId='
								+ this.teamId,
						root : 'data',
						preName : 'appTeam'
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
			url : __ctxPath + '/system/saveAppTeam.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('AppTeamGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});