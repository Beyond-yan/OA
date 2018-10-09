package com.gdssoft.oa.service.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.SysOaSite;

public interface SysOaSiteService extends BaseService<SysOaSite>{
	
	public List<SysOaSite> haveOwner(Long id);//判断是否已存在本站点
	public List<SysOaSite> haveOwner();
}


