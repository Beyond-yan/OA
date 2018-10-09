package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysOaSiteDao;
import com.gdssoft.oa.model.system.SysOaSite;
import com.gdssoft.oa.service.system.SysOaSiteService;

public class SysOaSiteServiceImpl extends BaseServiceImpl<SysOaSite> implements SysOaSiteService{
	@SuppressWarnings("unused")
	private SysOaSiteDao dao;
	
	public SysOaSiteServiceImpl(SysOaSiteDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	//判断是否已存在本站点
	public List<SysOaSite> haveOwner(Long id){
		return dao.haveOwner(id);
	}
	public List<SysOaSite> haveOwner(){
		return dao.haveOwner();
	}

}