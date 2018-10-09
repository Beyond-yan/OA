JwAttachfileView = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwAttachfileView.superclass.constructor.call(this, {
			id : 'JwAttachfileView',
			title : '附件管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},
	initUIComponents : function() {
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '附件编码',
				name : 'Q_attachcode_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '附件名称',
				name : 'Q_filepath_S_LK',
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
			//rowActions : true,
			id : 'JwAttachfileGrid',
			url : __ctxPath + "/jw/listJwAttachfile.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'attachcode', 'filepath' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '附件编码',
				width  : 80,
				dataIndex : 'attachcode'
			}, {
				header : '附件路径',
				dataIndex : 'filepath',
				renderer:function(v){
					return '<a href="http://10.224.5.177:8081'+(v.replace(/\\/g,'/'))+'">'+v+'</a>';
				}
			}]
		});
		//this.gridPanel.addListener('rowdblclick', this.rowClick);
	},
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	search : function() {
		$search({
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new JwAttachfileForm({
				id : rec.data.id
			}).show();
		});
	},
	createRs : function() {
		new JwAttachfileForm().show();
	},
	removeRs : function(id) {
		$postDel({
			url : __ctxPath + '/jw/multiDelJwAttachfile.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	removeSelRs : function() {
		$delGridRs({
			url : __ctxPath + '/jw/multiDelJwAttachfile.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	editRs : function(record) {
		new JwAttachfileForm({
			id : record.data.id
		}).show();
	},
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
