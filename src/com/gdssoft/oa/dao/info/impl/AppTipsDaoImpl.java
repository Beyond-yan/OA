package com.gdssoft.oa.dao.info.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.info.AppTipsDao;
import com.gdssoft.oa.model.info.AppTips;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class AppTipsDaoImpl extends BaseDaoImpl<AppTips> implements AppTipsDao{

	public AppTipsDaoImpl() {
		super(AppTips.class);
	}

}