package com.gdssoft.oa.service.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.communicate.MailBox;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface MailBoxService extends BaseService<MailBox>{

	public Long CountByFolderId(Long folderId);
	
	public List<MailBox> findByFolderId(Long folderId);

	public List<MailBox> findBySearch(String searchContent, PagingBean pb);
}


