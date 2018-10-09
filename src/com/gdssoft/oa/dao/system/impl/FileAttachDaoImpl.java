package com.gdssoft.oa.dao.system.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.oa.dao.system.FileAttachDao;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;

@SuppressWarnings("unchecked")
public class FileAttachDaoImpl extends BaseDaoImpl<FileAttach> implements
		FileAttachDao {

	public FileAttachDaoImpl() {
		super(FileAttach.class);
	}

	@Override
	public void removeByPath(final String filePath) {
		final String hql = "delete from FileAttach fa where fa.filePath = ?";
		getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query query = session.createQuery(hql);
				query.setString(0, filePath);
				return query.executeUpdate();
			}
		});
	}

	/**
	 * 按文件路径取得路径
	 * 
	 * @param filePath
	 */
	public FileAttach getByPath(String filePath) {
		String hql = "from FileAttach fa where fa.filePath = ?";
		return (FileAttach) findUnique(hql, new Object[] { filePath });
	}

	/**
	 * @description 分页查询附件信息,备注：图片格式[bmp,png,jpg,gif,tiff]
	 * @param pb
	 *            PagingBean
	 * @param bo
	 *            boolean,true:file文件,false:image图片文件
	 * @return List <FileAttach>
	 */
	@Override
	public List<FileAttach> fileList(PagingBean pb, String fileType, boolean bo) {
		String creator = ContextUtil.getCurrentUser().getFullname();
		ArrayList<String> paramList = new ArrayList<String>();
		paramList.add(creator);
		String hql = "select f from FileAttach f where f.creator = ? and ";
		if (fileType != null && !fileType.equals("")) {
			hql += "f.fileType like ? and ";
			paramList.add(fileType);
		}
		if (bo) // 未image图片文件
			hql += "f.ext not in('bmp','png','jpg','gif','tiff') ";
		else
			hql += "f.ext in('bmp','png','jpg','gif','tiff') ";
		hql += "order by f.createtime DESC ";
		logger.debug("FileAttach：" + hql);
		return findByHql(hql, paramList.toArray(), pb);
	}

	/**
	 * 查询所有满足fileType条件的数据
	 */
	@Override
	public List<FileAttach> fileList(String fileType) {
		String creator = ContextUtil.getCurrentUser().getFullname();
		ArrayList<String> paramList = new ArrayList<String>();
		String hql = "select f from FileAttach f where f.creator = ? and ";
		paramList.add(creator);
		if (!fileType.isEmpty()) {
			hql += "f.fileType like ? ";
			paramList.add(fileType);
		}
		hql += "order by f.createtime DESC ";
		logger.debug(hql);
		return findByHql(hql, paramList.toArray());
	}
	/**
	 * 获得公开文件的附件
	 */
	public List<FileAttach> findFileAttach(String hostUrl,Long archivesId,String schema) {
		String sql = "select b.FILEID,b.FILENAME,b.FILEPATH,b.EXT,b.NOTE,b.CREATOR FROM "+schema+".archives_attachment a JOIN "+schema+".file_attach b ON a.fileid = b.fileid where a.ARCHIVESID="+archivesId;
		Query q = getSession().createSQLQuery(sql);
		List list = q.list();
		List<FileAttach> fileAttachList=new ArrayList<FileAttach>();
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			FileAttach fileAttach = new FileAttach();
			fileAttach.setFileId(new Long(objs[0].toString()));
			fileAttach.setFileName(objs[1].toString());
			fileAttach.setFilePath(hostUrl+objs[2].toString());
			fileAttach.setExt(objs[3].toString());
			fileAttach.setNote(objs[4].toString());
			fileAttach.setCreator(objs[5].toString());
			fileAttachList.add(fileAttach);
		}
		return fileAttachList;
	}

	@Override
	public List getFileByArchivesId(String schemaCode, Long archivesId) {
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode + ".";
		String sql = "select fileId from " + schemaCode + "archives_attachment where archivesId = :archivesId";
		Query query = this.getSession().createSQLQuery(sql).setParameter("archivesId", archivesId);
		List list = query.list();
		// TODO Auto-generated method stub
		return list;
	}
}