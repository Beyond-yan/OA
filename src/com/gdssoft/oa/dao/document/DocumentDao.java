package com.gdssoft.oa.dao.document;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.document.Document;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface DocumentDao extends BaseDao<Document>{
	
	/**
	 * 查找共享的文档
	 * @param document
	 * @param from
	 * @param to
	 * @param userId
	 * @param roleIds
	 * @param depId
	 * @param pb
	 * @return
	 */
	public List<Document> findByIsShared(Document document,Date from,Date to,Long userId,ArrayList<Long> roleIds,Long depId,PagingBean pb);
	/**
	 * 查找公共文档
	 * @param folderId
	 * @param document
	 * @param from
	 * @param to
	 * @param appUser
	 * @param pb
	 * @return
	 */
	public List<Document> findByPublic(String path,Document document,Date from,Date to,AppUser appUser,PagingBean pb);
	/**
	 * 根据文件夹个人查找个人文档
	 */
	public List<Document> findByPersonal(Long userId,Document document,Date from,Date to,String path,PagingBean pb);
	/**
	 * 根据文件夹查找文档下面所有层的文档
	 */
	public List<Document> findByFolder(String path);
	/**
	 * 根据当前用户查找他可以看的文档，包括个人文档，共享文档，公共文档。
	 */
	public List<Document> searchDocument(AppUser appUser,String content,boolean isHaveData,PagingBean pb);
	
}