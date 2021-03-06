package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.archive.OdFlowtype;

/**
 * 
 * @author 
 *
 */
public interface OdFlowtypeDao extends BaseDao<OdFlowtype>{
	public List<OdFlowtype> getFlowByType(Short flowType);
}