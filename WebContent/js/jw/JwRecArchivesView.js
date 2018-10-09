JwRecArchivesView = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwRecArchivesView.superclass.constructor.call(this, {
			id : 'JwRecArchivesView',
			title : '收文查询',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel]
		});
	},
	initUIComponents : function() {
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '文件标题',
				name : 'Q_subject_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '收文编号',
				name : 'Q_inbumfno_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '发文单位',
				name : 'Q_sourcedepartment_S_LK',
				flex : 1,
				xtype : 'textfield'
			},  {
				fieldLabel : '来文字号',
				name : 'Q_bumfno_S_LK',
				flex : 1,
				xtype : 'textfield'
			} ,  {
				fieldLabel : '收文日期',
				name : 'Q_inbumfday_S_LK',
				flex : 1,
				xtype : 'textfield'
			} , 
			{
				fieldLabel : '成文日期',
				name : 'Q_bumfday_S_LK',
				flex : 1,
				xtype : 'textfield'
			} ],
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
		});
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			id : 'JwRecArchivesGrid',
			url : __ctxPath + "/jw/listJwRecArchives.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'subject', 'sourcedepartment', 'inbumfday', 'bumfday', 'bumfno',
					'inbumfno', 'keywords',
					'attachcode' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '文件标题',
				dataIndex : 'subject',
				  width:200,
				renderer:function(value, metadata, record, rowIndex,
							colIndex){
						var id=record.data.id;
						var str = '';
						str+='<a href="#"  onclick="JwRecArchivesView.detail('
							+ id+')">'+value+'</a>';
						return str;
				}
			}, {
				header : '收文编号',
				dataIndex : 'inbumfno'
			}, {
				header : '发文单位',
				dataIndex : 'sourcedepartment',
			   width:100
			}, {
				header : '来文字号',
				dataIndex : 'bumfno'
			}, {
				header : '收文日期',
				dataIndex : 'inbumfday'
			}, {
				header : '成文日期',
				dataIndex : 'bumfday',
				width:50
			}]
		});
	},
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	search : function() {
		$search({
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	}
});
JwRecArchivesView.detail= function(id) {
	new JwRecArchivesDetailForm({
		id:id
	}).show();
};