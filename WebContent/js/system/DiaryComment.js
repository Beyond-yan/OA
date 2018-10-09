/**
 * @author
 * @createtime
 * @class DiaryForm
 * @extends Ext.Window
 * @description Diary表单
 * @company 捷达世软件
 */
DiaryComment = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiaryComment.superclass.constructor.call(this, {
			id : 'DiaryCommentWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 470,
			width : 600,
			maximizable : true,
			title : '日志详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '提交意见',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '关闭',
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
			// id : 'DiaryForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diary.diaryId',
				xtype : 'hidden',
				value : this.diaryId == null ? '' : this.diaryId
			}, {
				fieldLabel : 'USER_ID',
				name : 'diary.userId',
				allowBlank : false,
				xtype : 'hidden'
			},{
				fieldLabel : '日志类型',
				xtype : 'combo',
				hiddenName : 'diary.diaryType',
				id : 'diaryType',
				mode : 'local',
				editable : false,
				value:'0',
				triggerAction : 'all',
				store :[['0','个人日志'],['1','工作日志']],
				style : 'background:#DCDCDC;',
				readOnly : true
			},{
				fieldLabel : '日期',
				name : 'diary.dayTime',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date(),
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '上班时间',
				name : 'diary.onDutyTime2',
				id:'CommnetOnTiemId2',
				//allowBlank : false,
				xtype : 'datetimefield',
				format : 'H:i',
				//value : new Date(),
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '下班时间',
				name : 'diary.offDutyTime2',
				id:'CommnetOffTiemId2',
				//allowBlank : false,
				xtype : 'datetimefield',
				format : 'H:i',
				//value : new Date(),
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '任务名称',
				name : 'diary.taskName',
				maxLength : 50,
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '工作内容',
				name : 'diary.workContent',
				allowBlank : false,
				xtype : 'textarea',
				maxLength : 1073741823,
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '评论人员ID',
				name : 'diary.commentUserId',
				xtype : 'hidden',
				readOnly : true
			}, {
				fieldLabel : '完成百分比',
				name : 'diary.completeStatus',
				xtype : 'numberfield',
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '未完成事项',
				name : 'diary.unfinishedWork',
				xtype : 'textarea',
				maxLength : 400,
				style : 'background:#DCDCDC;',
				readOnly : true
			},{
				fieldLabel : '主管意见',
				name : 'diary.comment',
				xtype : 'textarea',
				maxLength : 600
			},{	name : 'diary.offDutyTime',	
				id:'CommnetOffTiemId',
			    xtype : 'hidden'
			},{	name : 'diary.onDutyTime',	
				id:'CommnetOnTiemId',
			    xtype : 'hidden'
			},{name:'diary.status',//状态：表示审核状态：0未审核；1已审核
			   xtype : 'hidden',
			   id:'diaryCommentStatusId'			 
			} ]
		});
		// 加载表单对应的数据
		if (this.diaryId != null && this.diaryId != 'undefined') {
			this.formPanel
					.loadData( {
						url : __ctxPath + '/system/getDiary.do?diaryId='
								+ this.diaryId,
						root : 'data',
						preName : 'diary',
						success : function(response, options) {							
							var JsonData=Ext.util.JSON.decode(response.responseText);								
							var dd3 = "2012-03-01 "+JsonData.data.onDutyTime;
					        var d3 = dd3.replace(/\-/g, '\/');
					        var tempDateOnTime= new Date(d3);					        
					        var dd4 = "2012-03-01 "+JsonData.data.offDutyTime;
					        var d4 = dd4.replace(/\-/g, '\/');
					        var tempDateOffTime = new Date(d4);					      
							Ext.getCmp('CommnetOnTiemId').setValue( tempDateOnTime.dateFormat('Y-m-d H:i:s'));
							Ext.getCmp('CommnetOffTiemId').setValue(tempDateOffTime.dateFormat('Y-m-d H:i:s'));
							Ext.getCmp('CommnetOnTiemId2').setValue(JsonData.data.onDutyTime);
							Ext.getCmp('CommnetOffTiemId2').setValue(JsonData.data.offDutyTime);	
							Ext.getCmp('diaryCommentStatusId').setValue(1);//1已审核
						}
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
			url : __ctxPath + '/system/saveDiary.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiaryGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				var gridPanelSubUser=Ext.getCmp('MySubUserDiaryGrid');
				if(gridPanelSubUser!=null){
					gridPanelSubUser.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});