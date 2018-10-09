package com.gdssoft.oa.service.communicate.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.dao.communicate.OutMailDao;
import com.gdssoft.oa.model.communicate.OutMail;
import com.gdssoft.oa.service.communicate.OutMailService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class OutMailServiceImpl extends BaseServiceImpl<OutMail> implements OutMailService{
	private OutMailDao dao;
	
	public OutMailServiceImpl(OutMailDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<OutMail> findByFolderId(Long folderId){
		return dao.findByFolderId( folderId);
	}

	public Long CountByFolderId(Long folderId){
		return dao.CountByFolderId(folderId);
	}
	public Map getUidByUserId(Long userId){
		return dao.getUidByUserId(userId);
	}
	
}