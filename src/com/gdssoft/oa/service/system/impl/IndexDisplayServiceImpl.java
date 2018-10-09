package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.system.IndexDisplayDao;
import com.gdssoft.oa.model.system.IndexDisplay;
import com.gdssoft.oa.service.system.IndexDisplayService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class IndexDisplayServiceImpl extends BaseServiceImpl<IndexDisplay> implements IndexDisplayService{
	private IndexDisplayDao dao;
	
	public IndexDisplayServiceImpl(IndexDisplayDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<IndexDisplay> findByUser(Long userId) {
		return dao.findByUser(userId);
	}

}