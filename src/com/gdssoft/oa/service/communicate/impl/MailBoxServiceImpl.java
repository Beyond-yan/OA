package com.gdssoft.oa.service.communicate.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.MailBoxDao;
import com.gdssoft.oa.model.communicate.MailBox;
import com.gdssoft.oa.service.communicate.MailBoxService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class MailBoxServiceImpl extends BaseServiceImpl<MailBox> implements MailBoxService{
	private MailBoxDao dao;
	
	public MailBoxServiceImpl(MailBoxDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public Long CountByFolderId(Long folderId) {
		return dao.CountByFolderId(folderId);
	}

	public List<MailBox> findByFolderId(Long folderId){
		return dao.findByFolderId(folderId);
	}

	@Override
	public List<MailBox> findBySearch(String searchContent, PagingBean pb) {
		return dao.findBySearch(searchContent,pb);
	}
}