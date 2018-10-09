package com.gdssoft.oa.dao.snconfig.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.snconfig.FlowSnConfigDao;
import com.gdssoft.oa.model.snconfig.FlowSnConfig;

@SuppressWarnings("unchecked")
public class FlowSnConfigDaoImpl extends BaseDaoImpl<FlowSnConfig> implements FlowSnConfigDao{

	public FlowSnConfigDaoImpl() {
		super(FlowSnConfig.class);
	}

}