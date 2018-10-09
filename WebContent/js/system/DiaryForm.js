/**
 * @author
 * @createtime
 * @class DiaryForm
 * @extends Ext.Window
 * @description Diary表单
 * @company 捷达世软件
 */
DiaryForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiaryForm.superclass.constructor.call(this, {
			id : 'DiaryFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 470,
			width : 600,
			maximizable : true,
			title : '日志详细信息',
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
/*		var startDate = Ext.util.Format.date(new Date(),'Y-m-d');
		var startDateTimeString = startDate.toString()+" "+'9:00';
		var d1 = startDateTimeString.replace(/\-/g,'\/');
		var stratDate2 =new Date(d1);
		
		var endDateString = startDate.toString()+" "+'17:30';
		var d2 = endDateString.replace(/\-/g,'\/');
		var endDate =new Date(d2);*/
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			id:'DiaryForm',
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
				store :[['0','个人日志'],['1','工作日志']]
			},{
				fieldLabel : '日期',
				id : 'DiaryForm.diary.dayTime',
				name : 'diary.dayTime',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, new Ext.form.TimeField({
                fieldLabel: '上班时间',
                id:'diary.onDutyTime2',
               // name: 'diary.onDutyTime',
               	minValue: '0:00am',
                maxValue: '23:30pm',
                format : 'G:i',//G标示为24时计时法 
                increment:30,
                value:'9:00am'
            }),
            {
            	id:'diary.onDutyTime',
				name : 'diary.onDutyTime',
				xtype : 'hidden',
				value : ''
			},
			 {
            	id:'diary.offDutyTime',
				name : 'diary.offDutyTime',
				xtype : 'hidden',
				value : ''
			},
 			/*{
				fieldLabel : '上班时间',
				id:'diary.onDutyTime',
				name : 'diary.onDutyTime',
				xtype : 'datetimefield',
				format : 'Y-m-d H:i:s',
				allowBlank : false,
				editable : false,
				value:stratDate2
			}*/
		/*	{
				name : 'diary.onDutyTime',
				xtype : 'hidden',
				value : 
			}*/
			/*,{
				fieldLabel : '下班时间',
				id:'diary.offDutyTime',
				name : 'diary.offDutyTime',
				xtype : 'datetimefield',
				format : 'Y-m-d H:i:s',
				allowBlank : false,
				editable : false,
				value:endDate
			},*/
			new Ext.form.TimeField({
                fieldLabel: '下班时间',
                id:'diary.offDutyTime2',
               //	name: 'diary.offDutyTime',
                minValue: '0:00am',
                maxValue: '23:30pm',
                format : 'G:i',//G标示为24时计时法 
                value:'17:30am'
            })
            ,
			{
				fieldLabel : '任务名称',
				name : 'diary.taskName',
				maxLength : 50
			}, {
				fieldLabel : '工作内容',
				name : 'diary.workContent',
				allowBlank : false,
				xtype : 'textarea',
				maxLength : 1073741823
			}, {
				fieldLabel : '评论人员ID',
				name : 'diary.commentUserId',
				xtype : 'hidden'
			}, {
				fieldLabel : '完成百分比',
				name : 'diary.completeStatus',
				xtype : 'numberfield',
				allowBlank:false,
				minValue:0,
				maxValue:100,
				maskRe:/\d/
			}, {
				fieldLabel : '未完成事项',
				name : 'diary.unfinishedWork',
				xtype : 'textarea',
				maxLength : 400
			},{
				fieldLabel : '评论内容',
				name : 'diary.comment',
				xtype : 'textarea',
				maxLength : 600,
				id:'diary.comment',
				style : 'background:#DCDCDC;',
				readOnly : true
			} ]
		});
		
		var com = Ext.getCmp('diary.comment');
		if(this.oper=='add'){
			this.formPanel.items.remove(com);
			this.formPanel.doLayout(true);
		}
		
		// 加载表单对应的数据
		if (this.diaryId != null && this.diaryId != 'undefined') {
			this.formPanel
					.loadData( {
						url : __ctxPath + '/system/getDiary.do?diaryId='
								+ this.diaryId,
						root : 'data',
						preName : 'diary'
					});
			Ext.getCmp('diary.onDutyTime2').setValue(this.startTime);
			Ext.getCmp('diary.offDutyTime2').setValue(this.endTime);
			this.formPanel.doLayout(true);
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
		
		var dayTime = Ext.util.Format.date(Ext.getCmp("DiaryForm.diary.dayTime").getValue(),'Y-m-d');
		var onDutyTime = Ext.getCmp("diary.onDutyTime2").getValue();
		var startDateTimeString = dayTime.toString() + " "+onDutyTime.toString()+":00";
		var d1 = startDateTimeString.replace(/\-/g,'\/');
		var stratDate =new Date(d1);
		
		var offDutyTime = Ext.getCmp("diary.offDutyTime2").getValue();
		var endDateString = dayTime.toString() + " "+offDutyTime.toString()+":00";
		var d2 = endDateString.replace(/\-/g,'\/');
		var endDate =new Date(d2);
		Ext.getCmp('diary.onDutyTime').setValue(startDateTimeString);
		Ext.getCmp('diary.offDutyTime').setValue(endDateString);
		
		if(stratDate>=endDate){
			Ext.Msg.alert("注意", "上班时间应小于下班时间！");
			return;
		}
		
		/*var saveFlag = true;
		Ext.Ajax.request({
					url : __ctxPath + "/system/listDiary.do",
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
						Q_dayTime_D_EQ :Ext.util.Format.date( this.formPanel.getForm()
								.findField('DiaryForm.diary.dayTime')
								.getValue(),'Y-m-d')
					}
				});

		if (!saveFlag) {
			Ext.ux.Toast.msg("操作信息", "今天的工作日志已经填写完成，不能保存！");
			return;
		}*/
		
//		$postForm( {
//			formPanel : this.formPanel,
//			scope : this,
//			url : __ctxPath + '/system/saveDiary.do',
//			callback : function(fp, action) {
//				var result = Ext.util.JSON.decode(action.response.responseText);
//				if(result.message=='error'){
//					Ext.MessageBox.show({
//									title : '操作信息',
//									msg : '保存失败，当前输入的时间区域与已经输入的时间段存在重复！',
//									buttons : Ext.MessageBox.OK,
//									icon : 'ext-mb-error'
//								});
//					
//				}else{
//					var gridPanel = Ext.getCmp('DiaryGrid');
//					if (gridPanel != null) {
//						gridPanel.getStore().reload();
//					}
//					this.close();
//				}
//				return;
//			}
//			
//		});
		
		
		if(this.formPanel.getForm().isValid()){
			this.formPanel.getForm().submit({
					scope:this,
					url : __ctxPath + '/system/saveDiary.do',
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						var result = Ext.util.JSON.decode(action.response.responseText);
						if(result.message=='error'){
							Ext.MessageBox.show({
									title : '操作信息',
									msg : '保存失败，当前输入的时间区域与已经输入的时间段存在重复！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
						}else  {
							Ext.ux.Toast.msg('操作信息', '成功信息保存,共'+result.hour+'小时！');
							var gridPanel = Ext.getCmp('DiaryGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
						
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

	}// end of save

});