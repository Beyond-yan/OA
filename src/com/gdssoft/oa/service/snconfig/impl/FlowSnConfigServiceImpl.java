package com.gdssoft.oa.service.snconfig.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.snconfig.FlowSnConfigDao;
import com.gdssoft.oa.model.snconfig.FlowSnConfig;
import com.gdssoft.oa.service.snconfig.FlowSnConfigService;

public class FlowSnConfigServiceImpl extends BaseServiceImpl<FlowSnConfig> implements FlowSnConfigService{
	@SuppressWarnings("unused")
	private FlowSnConfigDao dao;
	
	public FlowSnConfigServiceImpl(FlowSnConfigDao dao) {
		super(dao);
		this.dao=dao;
	}

}