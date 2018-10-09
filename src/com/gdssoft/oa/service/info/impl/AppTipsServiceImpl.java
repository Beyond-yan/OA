package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.info.AppTipsDao;
import com.gdssoft.oa.model.info.AppTips;
import com.gdssoft.oa.service.info.AppTipsService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class AppTipsServiceImpl extends BaseServiceImpl<AppTips> implements AppTipsService{
	private AppTipsDao dao;
	
	public AppTipsServiceImpl(AppTipsDao dao) {
		super(dao);
		this.dao=dao;
	}

}