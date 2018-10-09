package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.archive.OdFlowtype;

public interface OdFlowtypeService extends BaseService<OdFlowtype>{
	public List<OdFlowtype> getFlowByType(Short flowType);
}


