package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Date;

import com.gdssoft.oa.dao.archive.ArchHastenDao;
import com.gdssoft.oa.model.archive.ArchHasten;
import com.gdssoft.oa.service.archive.ArchHastenService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchHastenServiceImpl extends BaseServiceImpl<ArchHasten> implements ArchHastenService{
	private ArchHastenDao dao;
	
	public ArchHastenServiceImpl(ArchHastenDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public Date getLeastRecordByUser(Long archivesId) {
		return dao.getLeastRecordByUser(archivesId);
	}

}