package com.gdssoft.oa.dao.system;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.util.List;

import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * @description 附件分类管理
 * @author YHZ
 * @datatime 2010-11-20PM
 * 
 */
public interface FileAttachDao extends BaseDao<FileAttach> {

	void removeByPath(String filePath);

	/**
	 * 按文件路径取得路径
	 */
	FileAttach getByPath(String filePath);

	/**
	 * 分页查询图片
	 * 参数[pb:PagingBean,filePath:fileType搜索条件,bo:boolean{true:file文件,false:
	 * image图片}]
	 */
	List<FileAttach> fileList(PagingBean pb, String fileType, boolean bo);

	/**
	 * @description 根据fileType查询所有满足条件的数据
	 * @param fileType
	 *            fileType搜索条件
	 * @return List<FileAttach>
	 */
	List<FileAttach> fileList(String fileType);
	/**
	 * 获得公开文件的附件
	 */
	public List<FileAttach> findFileAttach(String hostUrl,Long archivesId,String schema);
	
	public List getFileByArchivesId(String schemaCode, Long archivesId);
}