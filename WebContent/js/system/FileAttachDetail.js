/*
 * 文件附件详细
 */
Ext.ns('FileAttachDetail');
FileAttachDetail.show=function(fileId,id){
	var window = new Ext.Window({
				title : '文件详细信息',
				iconCls : 'menu-attachment',
				width : 480,
				height : 280,
				modal : true,
				layout : 'form',
				buttonAlign : 'center',
				autoLoad:{
					url:__ctxPath+'/fileDetail.do?fileId='+fileId +'&id='+id
				},
				buttons:[
				{
					xtype:'button',
					iconCls:'btn-close',
					text:'关闭',
					handler:function(){
						window.close();
					}
				}
				]
	});
	window.show();
};