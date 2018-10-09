package com.gdssoft.oa.service.document.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.oa.dao.document.DocPrivilegeDao;
import com.gdssoft.oa.dao.document.DocumentDao;
import com.gdssoft.oa.model.document.Document;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.document.DocumentService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class DocumentServiceImpl extends BaseServiceImpl<Document> implements DocumentService{
	private DocumentDao dao;
	@Resource
	private DocPrivilegeDao docPrivilegeDao;
	
	public DocumentServiceImpl(DocumentDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<Document> findByIsShared(Document document, Date from, Date to,
			Long userId, ArrayList<Long> roleIds, Long depId, PagingBean pb) {
		return dao.findByIsShared(document, from, to, userId, roleIds, depId, pb);
	}

	@Override
	public List<Document> findByPublic(String path,Document document,Date from,Date to,AppUser appUser, PagingBean pb) {
		return dao.findByPublic(path,document, from, to, appUser, pb);
	}

	@Override
	public List<Document> findByPersonal(Long userId, Document document,
			Date from, Date to, String path, PagingBean pb) {
		return dao.findByPersonal(userId, document, from, to, path, pb);
	}

	@Override
	public List<Document> findByFolder(String path) {
		return dao.findByFolder(path);
	}

	@Override
	public List<Document> searchDocument(AppUser appUser, String content,
			PagingBean pb) {
			boolean isHaveData=false;
			Integer count=docPrivilegeDao.countPrivilege();
			if(count>0){
				isHaveData=true;
			}
			return dao.searchDocument(appUser, content,isHaveData, pb);
		}

	


}