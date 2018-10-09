package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;

import com.gdssoft.oa.dao.system.IndexDisplayDao;
import com.gdssoft.oa.model.system.IndexDisplay;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class IndexDisplayDaoImpl extends BaseDaoImpl<IndexDisplay> implements IndexDisplayDao{

	public IndexDisplayDaoImpl() {
		super(IndexDisplay.class);
	}

	@Override
	public List<IndexDisplay> findByUser(Long userId) {
		String hql="from IndexDisplay vo where vo.appUser.userId=?";
		return findByHql(hql,new Object[]{userId});
	}

}