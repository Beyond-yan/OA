GoodsApplyCheck=Ext.extend(Ext.Window,{
	constructor:function(conf){
		Ext.apply(this,conf);
		this.initUICmps();
		GoodsApplyCheck.superclass.constructor.call(this,{
			title:'办公用品申请审批',
			width:600,
			height:380,
			autoScroll:true,
			bodyStyle:'background-color: white',
			maximizable : true,
			modal : true,
			items:[
				this.formPanel
			],
			buttonAlign:'center',
			buttons:[
			{
				xtype:'button',
				text:'通过',
				iconCls:'btn-ok',
				scope:this,
				handler:function(){
					var win=this;
					$request({
						url:__ctxPath+'/admin/checkGoodsApply.do',
						params:{
							applyId:conf.applyId,
							approvalStatus:1
						},
						success:function(response,options){
							var result=Ext.util.JSON.decode(response.responseText);
							Ext.ux.Toast.msg('操作信息','成功提交：'+ result.message);
							Ext.getCmp('GoodsApplyGrid').getStore().reload();
							win.close();
						}
					});
				}
			},
			{
				xtype:'button',
				text:'未通过',
				iconCls:'btn-delete_copy',
				scope:this,
				handler:function(){
					var win=this;
					$request({
						url:__ctxPath+'/admin/checkGoodsApply.do',
						params:{
							applyId:conf.applyId,
							approvalStatus:2
						},
						success:function(response,options){
							var result=Ext.util.JSON.decode(response.responseText);
							Ext.ux.Toast.msg('操作信息','成功提交:' + result.message);
							Ext.getCmp('GoodsApplyGrid').getStore().reload();
							win.close();
						}
					});
				}
			},{
				xtype:'button',
				text:'关闭',
				iconCls:'btn-close',
				scope:this,
				handler:function(){
					this.close();
				}
			}
			]
		});
	},
	initUICmps:function(){
		
		this.formPanel=new Ext.form.FormPanel({
			xtype:'form',
			bodyStyle:'padding:8px',
			border:false,
			defaults:{
				xtype:'label'
			},
			items:[
				{
					fieldLabel : '申请日期',
					id : 'applyDate'
				},{
					fieldLabel :'办公用品名称',
					id:'goodsName'
				},
				{
					fieldLabel : '申请数量',
					id : 'useCounts'
				},
				{
					fieldLabel:'申请人',
					id : 'proposer'
				},
				{
					fieldLabel : '审批状态 ',
					id : 'approvalStatus'
				},{
					fieldLabel : '备注',
					id : 'notes'
				}
			]
		});
		var formPanel=this.formPanel;
		if (this.applyId != null && this.applyId != 'undefined') {
			$request({
				url : __ctxPath + '/admin/getGoodsApply.do?applyId=' + this.applyId,
				success : function(response, option) {
					var data=Ext.util.JSON.decode(response.responseText).data;

					Ext.getCmp('applyDate').setText(data.applyDate);
					Ext.getCmp('goodsName').setText(data.officeGoods.goodsName);
					Ext.getCmp('useCounts').setText(data.useCounts);
					Ext.getCmp('proposer').setText(data.proposer);
					var approvalText='';
					if(data.approvalStatus==0){
						approvalText='未审批';
					}else if(data.approvalStatus==1){
						approvalText='通过审批';
					}else{
						approvalText='未通过审批';
					}
					Ext.getCmp('approvalStatus').setText(approvalText);
					Ext.getCmp('notes').setText(data.notes);
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}
		
	}
});