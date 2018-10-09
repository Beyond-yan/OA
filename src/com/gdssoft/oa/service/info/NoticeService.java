package com.gdssoft.oa.service.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.info.Notice;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface NoticeService extends BaseService<Notice> {
	public List<Notice> findByNoticeId(Long noticeId,PagingBean pb);
	public List<Notice> findBySearch(Notice notice,Date from,Date to,PagingBean pb);
	public List<Notice> findBySearch(String searchContent, PagingBean pb);
	
	//add by smart on 20110520
 	public List<Notice> findBySearch(String searchContent,Integer auditingStatus,PagingBean pb);
 	
 	
 	public List<Notice> getDaibanNotice(AppUser user,PagingBean pb) ;
}
