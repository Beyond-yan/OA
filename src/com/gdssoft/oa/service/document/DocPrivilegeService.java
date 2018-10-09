package com.gdssoft.oa.service.document;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.document.DocPrivilege;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface DocPrivilegeService extends BaseService<DocPrivilege>{
	public List<DocPrivilege> getAll(DocPrivilege docPrivilege,Long folderId,PagingBean pb);
	public List<Integer> getRightsByFolder(AppUser user, Long folderId);
	public Integer getRightsByDocument(AppUser user, Long docId);
}


