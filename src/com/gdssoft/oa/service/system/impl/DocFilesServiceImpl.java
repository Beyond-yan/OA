package com.gdssoft.oa.service.system.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFFooter;
import org.apache.poi.hssf.usermodel.HSSFHeader;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFCellUtil;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

import com.gdssoft.core.Constants;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.ArchivesDocDao;
import com.gdssoft.oa.dao.system.DocFilesDao;
import com.gdssoft.oa.dao.system.FileAttachDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFiles;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.gdssoft.oa.service.system.FileAttachService;

public class DocFilesServiceImpl extends BaseServiceImpl<DocFiles> implements
		DocFilesService {

	private DocFilesDao dao;
	@Resource
	private ArchivesService archivesService;
	@Resource
	AppUserService appUserService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private FileAttachService fileAttachService;

	@Resource
	private ArchivesDocDao archivesDocDao;
	@Resource
	private FileAttachDao fileAttachDao;

	public DocFilesServiceImpl(DocFilesDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public List findByDirectoryId(Long strDirId) {
		return dao.findByDirectoryId(strDirId);
	}

	@Override
	public List findByDocDirectory(String path, PagingBean pb, String name,
			Date fileDate, Date retention, String code) {
		return null;
	}

	/**
	 * 根据公文Id将存在待归档目录
	 * 
	 * @param archivesId
	 * @param createUser
	 */
	public void saveDocFilesFromArchives(Long archivesId, String createUser) {
		Archives archives = archivesService.get(archivesId);
		saveArchiveToFiles(archives, createUser);
		archives.setStatus(Short.parseShort(String
				.valueOf(Constants.ArchivesStatus.FILED)));
		archivesService.save(archives);
	}

	/**
	 * 批量根据公文Id将存在待归档目录
	 * 
	 * @param archivesIdList
	 * @param createUser
	 */
	public void saveDocFilesFromArchivesList(List<Archives> archivesList,
			String createUser) {
		for (Archives archives : archivesList)
			saveArchiveToFiles(archives, createUser);
	}

	/**
	 * 归档
	 * 
	 * @param archives
	 * @param createUser
	 */
	private void saveArchiveToFiles(Archives archives, String createUser) {
		if (null == archives)
			return;
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		DocFiles docFiles = new DocFiles();
		docFiles.setArchives(archives);
		docFiles.setFileName(archives.getSubject());
		if ("0".equals(archives.getArchType().toString())) {
			AppUser user = appUserService.get(archives.getIssuerId());
			docFiles.setDepartment(user.getDepartment());
		} else {
			if (archives.getOrgDepId() != null
					&& StringUtils.isNotEmpty(archives.getOrgDepId())) {
				Department depart = departmentService.get(new Long(archives
						.getOrgDepId()));
				docFiles.setDepartment(depart);
			} else {
				AppUser user = appUserService.get(archives.getIssuerId());
				docFiles.setDepartment(user.getDepartment());
			}
		}
		if ("0".equals(archives.getArchType().toString())) {
			docFiles.setFileNo(archives.getArchivesNo());
		} else {
			docFiles.setFileNo(archives.getDepSignNo());
		}
		docFiles.setPageCount(archives.getFileCounts());
		docFiles.setFileType(archives.getArchType());
		docFiles.setDutyPerson(archives.getIssuer());
		docFiles.setSecretLevel(archives.getPrivacyLevel());
		// sourceType来区分旧数据和新数据
		docFiles.setSourceType((long) 0);
		// 来文单位的新增字段
		docFiles.setFileIssup(archives.getIssueDep());
		docFiles.setRetentionYear(1);// 归档时间，默认0
		// docFiles.setSecretLevel(0);
		docFiles.setFileStatus(Short.valueOf("0"));
		docFiles.setFileDate(archives.getCreatetime());
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		docFiles.setFileYear(sdf.format(archives.getCreatetime()));
		docFiles.setRemark(archives.getSubject());
		docFiles.setCreateUser(createUser);
		docFiles.setCreateDate(new Date());
		dao.saveDocFiles(schemaCode, docFiles);

		/*
		 * Set filesSet = new HashSet(); Set archiveDocs =
		 * archives.getArchivesDocs();//获得正文 Iterator archDoc =
		 * archiveDocs.iterator();//遍历正文 while(archDoc.hasNext()){ ArchivesDoc
		 * archivesDoc = (ArchivesDoc)archDoc.next(); Long fileId =
		 * archivesDoc.getFileId(); FileAttach fa=fileAttachService.get(fileId);
		 * filesSet.add(fa); } Set archivesFiles =
		 * archives.getArchivesAttends();//获得附件 filesSet.addAll(archivesFiles);
		 * docFiles.setFileList(filesSet); dao.save(docFiles);
		 */

		Long docFileId = dao.findMaxId("");

		// Long docFileId = docFiles.getId();//获得文件Id
		Set archiveDocs = archives.getArchivesDocs();// 获得正文
		Iterator archDoc = archiveDocs.iterator();// 遍历正文
		while (archDoc.hasNext()) {
			ArchivesDoc archivesDoc = (ArchivesDoc) archDoc.next();
			Long fileId = archivesDoc.getFileId();
			saveFileAttach("", docFileId, fileId);
		}
		Set archivesFiles = archives.getArchivesFiles();// 获得附件
		Iterator archFile = archivesFiles.iterator();// 遍历附件
		while (archFile.hasNext()) {
			FileAttach flieAttach = (FileAttach) archFile.next();
			Long fileId = flieAttach.getFileId();
			saveFileAttach("", docFileId, fileId);
		}

	}

	/**
	 * 批量自动归档
	 * 
	 * @param schemaCode
	 * @param docFile
	 */
	public void saveArchiveToFiles(String schemaCode,
			List<Archives> archiveList, String createUser) {
		if (null == archiveList || archiveList.size() < 0)
			return;
		for (Archives archives : archiveList) {
			int docFilesList = findDocFilesByArchives(schemaCode,
					archives.getArchivesId());
			if (docFilesList > 0)
				continue;
			DocFiles docFiles = new DocFiles();
			docFiles.setArchives(archives);
			docFiles.setFileName(archives.getSubject());
			System.out.println("archives:" + archives.getArchivesId());
			AppUser user = appUserService.findSchemaUserByUserId(
					schemaCode,
					null == archives.getIssuerId() ? 0l : archives
							.getIssuerId());
			if (null != user)
				docFiles.setDepartment(user.getDepartment());
			docFiles.setFileNo(archives.getArchivesNo());
			docFiles.setPageCount(archives.getFileCounts());
			docFiles.setFileType(archives.getArchType());
			docFiles.setDutyPerson(archives.getIssuer());
			docFiles.setSecretLevel(archives.getPrivacyLevel());
			// docFiles.setSecretLevel(0);
			docFiles.setFileStatus(Short.valueOf("0"));
			docFiles.setFileDate(archives.getCreatetime());
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
			docFiles.setFileYear(sdf.format(archives.getCreatetime()));
			docFiles.setRemark(archives.getSubject());
			docFiles.setRetentionYear(0);
			docFiles.setCreateUser(createUser);
			docFiles.setUpdateUser(createUser);
			docFiles.setFileIssup(archives.getIssueDep());
			saveDocFiles(schemaCode, docFiles);

			Long docFileId = dao.findMaxId(schemaCode);// 获得文件Id
			List docList = archivesDocDao.getDocByArchivesId(schemaCode,
					archives.getArchivesId());// 查询正文Id
			for (int i = 0; i < docList.size(); i++) {
				saveFileAttach(schemaCode, docFileId, new Long(docList.get(i)
						.toString()));
			}
			/*
			 * Set archiveDocs = archives.getArchivesDocs();//获得正文 Iterator
			 * archDoc = archiveDocs.iterator();//遍历正文 while(archDoc.hasNext()){
			 * ArchivesDoc archivesDoc = (ArchivesDoc)archDoc.next(); Long
			 * fileId = archivesDoc.getFileId(); saveFileAttach(schemaCode,
			 * docFileId, fileId); }
			 */
			List fileList = fileAttachDao.getFileByArchivesId(schemaCode,
					archives.getArchivesId());// 查询正文Id
			for (int i = 0; i < fileList.size(); i++) {
				saveFileAttach(schemaCode, docFileId, new Long(fileList.get(i)
						.toString()));
			}
			/*
			 * Set archivesFiles = archives.getArchivesFiles();//获得附件 Iterator
			 * archFile = archivesFiles.iterator();//遍历附件
			 * while(archFile.hasNext()){ FileAttach flieAttach =
			 * (FileAttach)archFile.next(); Long fileId =
			 * flieAttach.getFileId(); saveFileAttach(schemaCode, docFileId,
			 * fileId); }
			 */

		}
	}

	/**
	 * 自动归档
	 * 
	 * @param schemaCode
	 * @param docFile
	 */
	public void saveDocFiles(String schemaCode, DocFiles docFile) {
		dao.saveDocFiles(schemaCode, docFile);
	}

	/**
	 * 对自动归档正文和附件进行保存
	 * 
	 * @param schemaCode
	 * @param docFileId
	 * @param fileId
	 */
	public void saveFileAttach(String schemaCode, Long docFileId, Long fileId) {
		dao.saveFileAttach(schemaCode, docFileId, fileId);
	}

	/**
	 * 查看公文是否已自动归档
	 * 
	 * @param schemaCode
	 * @param archivesId
	 */
	public int findDocFilesByArchives(String schemaCode, Long archivesId) {
		return dao.findDocFilesByArchives(schemaCode, archivesId);
	}

	/**
	 * 档案列表导出excel add by sicen.liu
	 */
	public InputStream sentNewListToExcel(DocDirectory docDirectory,
			List<DocFiles> list) {
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd ");
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is = null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			sheet1.setPrintGridlines(true);
			sheet1.setDefaultRowHeightInPoints((float) 50);
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setUsePage(true);
			printSetup.setPageStart((short) 1);
			// A4纸张
			printSetup.setPaperSize((short) 9);
			// 打印方向:true，横打；false，竖打
			printSetup.setLandscape(false);
			HSSFFooter footer = sheet1.getFooter();
			footer.setCenter(HSSFHeader.fontSize((short) 13) + "第 "
					+ HSSFFooter.page() + " 页,　共 " + HSSFFooter.numPages()
					+ " 页");
			// sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints((float) 47.25);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("归 档 文 件 目 录");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$G$1"));
			Row headerRow1 = sheet1.createRow(1);
			headerRow1.setHeightInPoints(24);
			Cell headerCell1;
			// header1 第1列
			headerCell1 = headerRow1.createCell(0);
			headerCell1.setCellValue("年度:");
			headerCell1.setCellStyle(styles.get("header1"));

			// header1 第2列
			headerCell1 = headerRow1.createCell(1);
			headerCell1.setCellValue(docDirectory.getDirYear());
			headerCell1.setCellStyle(styles.get("headCellFont1"));
			// header1 第3列
			headerCell1 = headerRow1.createCell(2);
			headerCell1.setCellValue("部门:");
			headerCell1.setCellStyle(styles.get("header1"));
			// header1 第4列
			headerCell1 = headerRow1.createCell(3);
			headerCell1.setCellStyle(styles.get("headCellFont1"));
			if (docDirectory.getDepartment() != null) {
				headerCell1.setCellValue(docDirectory.getDepartment()
						.getDepName());
			} else {
				headerCell1.setCellValue("");
			}
			headerCell1 = headerRow1.createCell(4);
			headerCell1.setCellValue("保管期限:");
			headerCell1.setCellStyle(styles.get("header1"));
			// header1 第4列
			headerCell1 = headerRow1.createCell(5);
			headerCell1.setCellStyle(styles.get("headCellFont1"));
			if (docDirectory.getRetentionYear() == 0) {
				headerCell1.setCellValue("永久");
			} else if (docDirectory.getRetentionYear() == 1) {
				headerCell1.setCellValue("待分类");
			} else if (docDirectory.getRetentionYear() == 10) {
				headerCell1.setCellValue("10年");
			} else {
				headerCell1.setCellValue("30年");
			}
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$F$2:$G$2"));
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints((float) 26.25);
			Cell headerCell2;
			// 第2行 第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("件号");
			headerCell2.setCellStyle(styles.get("header2"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("责任者");
			headerCell2.setCellStyle(styles.get("header2"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("文号");
			headerCell2.setCellStyle(styles.get("header2"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("题名");
			headerCell2.setCellStyle(styles.get("header2"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("日期");
			headerCell2.setCellStyle(styles.get("header2"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("页数");
			headerCell2.setCellStyle(styles.get("header2"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("备注");
			headerCell2.setCellStyle(styles.get("header2"));
			sheet1.setColumnWidth(0, (short) 7 * 255);
			sheet1.setColumnWidth(1, (short) 11 * 255);
			sheet1.setColumnWidth(2, (short) 11 * 255);
			sheet1.setColumnWidth(3, (short) 31 * 255);
			sheet1.setColumnWidth(4, (short) 12 * 255);
			sheet1.setColumnWidth(5, (short) 9 * 255);
			sheet1.setColumnWidth(6, (short) 7 * 255);
			Region region2 = new Region(2, (short) 0, 2, (short) 6);
			this.setRegionStyle(sheet1, region2, styles.get("header2"));
			sheet1.createFreezePane(7, 3);
			sheet1.createDrawingPatriarch();
			int rownum = 3;

			Cell cell = null;
			if (list != null && list.size() > 0) {
				if (docDirectory.getIsMakeFileNumber() != null
						&& "1".equals(docDirectory.getIsMakeFileNumber()
								.toString())) {
					Collections.sort(list, new Comparator() {
						public int compare(Object a, Object b) {
							int ret = 0;
							Long m1 = ((DocFiles) a).getFileNumber();
							Long m2 = ((DocFiles) b).getFileNumber();
							ret = m1.compareTo(m2);
							return ret;
						}
					});
				}
				for (DocFiles iter : list) {
					Row row = sheet1.createRow(rownum);
					row.setHeightInPoints((float) 50);
					for (int j = 0; j < 6; j++) {
						cell = row.createCell(j);
						if (j == 0) {
							if (iter.getFileNumber() != null) {
								cell.setCellValue(iter.getFileNumber());
							} else {
								cell.setCellValue("");
							}
							cell.setCellStyle(styles.get("cell1"));
						} else if (j == 1) {
							if (iter.getFileIssup() != null) {
								cell.setCellValue(iter.getFileIssup());
							} else {
								cell.setCellValue("");
							}
							cell.setCellStyle(styles.get("cell2"));
						} else if (j == 2) {
							cell.setCellValue(iter.getFileNo());
							cell.setCellStyle(styles.get("cell2"));
						} else if (j == 3) {
							cell.setCellValue(iter.getFileName());
							cell.setCellStyle(styles.get("cell2"));
						} else if (j == 4) {
							if (iter.getFileDate() != null) {
								cell.setCellValue(sf.format(iter.getFileDate())
										.toString());
							} else {
								cell.setCellValue("");
							}
							cell.setCellStyle(styles.get("cell1"));
						} else if (j == 5) {
							cell.setCellValue(iter.getPageCount());
							cell.setCellStyle(styles.get("cell1"));
						} else if (j == 6) {
							cell.setCellValue("");
						}
					}
					rownum++;
				}
			}
			// sheet1.setColumnWidth(0, (short)50);
			// sheet1.autoSizeColumn(0);
			// 使用apache的commons-lang.jar产生随机的字符串作为文件名
			String fileName = RandomStringUtils.randomAlphanumeric(10);
			// 生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
			StringBuffer sb = new StringBuffer(fileName);

			final File file = new File(sb.append(".xls").toString());
			try {
				OutputStream os = new FileOutputStream(file);
				try {
					wb.write(os);
					os.close();
				} catch (IOException e) {
					e.printStackTrace();
				}

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}

			try {
				is = new FileInputStream(file);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
		}
		return is;// 返回的是一个输入流

	}

	/**
	 * 档案列表导出excel add by sicen.liu
	 */
	public InputStream sentlistToExcel(DocDirectory docDirectory,
			List<DocFiles> list,String user) {
		if(docDirectory.getDirYear()>2015){

			SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd ");
			HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
			InputStream is = null;
			for (int k = 0; k < wbs.length; k++) {
				// 1.新建一个Excel模板
				HSSFWorkbook wb = wbs[k];
				Map<String, CellStyle> styles = createStyles(wb);
				CreationHelper createHelper = wb.getCreationHelper();
				// 2.新建第一个sheet
				HSSFSheet sheet1 = wb.createSheet("sheet1");
				sheet1.setPrintGridlines(false);
				sheet1.setDefaultRowHeightInPoints((float) 50);
				PrintSetup printSetup = sheet1.getPrintSetup();
				printSetup.setUsePage(true);
				printSetup.setPageStart((short) 1);
				// A4纸张
				printSetup.setPaperSize((short) 9);
				// 打印方向:true，横打；false，竖打
				printSetup.setLandscape(true);
				HSSFFooter footer = sheet1.getFooter();
				footer.setRight("——" + HSSFFooter.page() + "—— ");
				// footer.setCenter(HSSFHeader.fontSize((short)
				// 13)+"第 "+HSSFFooter.page()+" 页,　共 "+HSSFFooter.numPages()+" 页");
				// sheet1.setFitToPage(true);
				sheet1.setHorizontallyCenter(true);

				// title row
//				Row titleRow = sheet1.createRow(0);
//				titleRow.setHeightInPoints((float) 50);
//				Cell titleCell = titleRow.createCell(0);
//				titleCell.setCellValue("附录B 归档文件目录样式");
//				titleCell.setCellStyle(styles.get("header0"));
//				sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$H$1"));
				
				Row titleRow1 = sheet1.createRow(0);
				titleRow1.setHeightInPoints((float) 50);
				Cell titleCell1 = titleRow1.createCell(0);
				titleCell1.setCellValue("归档文件目录");
				titleCell1.setCellStyle(styles.get("title"));
				sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$H$1"));

				Row headerRow2 = sheet1.createRow(1);
				headerRow2.setHeightInPoints((float) 26.25);
				Cell headerCell2;
				// 第2行 第1列
				headerCell2 = headerRow2.createCell(0);
				headerCell2.setCellValue("档号");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(1);
				headerCell2.setCellValue("文号");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(2);
				headerCell2.setCellValue("责任者");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(3);
				headerCell2.setCellValue("题名");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(4);
				headerCell2.setCellValue("日期");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(5);
				headerCell2.setCellValue("页数");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(6);
				headerCell2.setCellValue("密级");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(7);
				headerCell2.setCellValue("备注");
				headerCell2.setCellStyle(styles.get("header2"));
				sheet1.setColumnWidth(0, (short) 21 * 255);
				sheet1.setColumnWidth(1, (short) 15 * 255);
				sheet1.setColumnWidth(2, (short) 15 * 255);
				sheet1.setColumnWidth(3, (short) 45 * 255);
				sheet1.setColumnWidth(4, (short) 12 * 255);
				sheet1.setColumnWidth(5, (short) 8 * 255);
				sheet1.setColumnWidth(6, (short) 8 * 255);
				sheet1.setColumnWidth(7, (short) 8 * 255);
				sheet1.createFreezePane(8, 3);
				sheet1.createDrawingPatriarch();
				int rownum = 2;

				Cell cell = null;
				if (list != null && list.size() > 0) {
					if (docDirectory.getIsMakeFileNumber() != null
							&& "1".equals(docDirectory.getIsMakeFileNumber()
									.toString())) {
						Collections.sort(list, new Comparator() {
							public int compare(Object a, Object b) {
								int ret = 0;
								Long m1 = ((DocFiles) a).getFileNumber();
								Long m2 = ((DocFiles) b).getFileNumber();
								ret = m1.compareTo(m2);
								return ret;
							}
						});
					}
					for (DocFiles iter : list) {
						Row row = sheet1.createRow(rownum);
						//row.setHeightInPoints((float) 26.25);
						for (int j = 0; j < 8; j++) {
							cell = row.createCell(j);
							int height=1;
							if (j == 0) {
								if (iter.getFileNumber() != null) {
									String fileNubmer = "0000"
											+ iter.getFileNumber();
									String qiXian = "";
									if (docDirectory.getRetentionYear() == 0) {
										qiXian = "Y";
									} else if (docDirectory.getRetentionYear() == 1) {
										qiXian = "N";
									} else if (docDirectory.getRetentionYear() == 10) {
										qiXian = "D10";
									} else {
										qiXian = "D30";
									}
									if(user.startsWith("glj")){
										cell.setCellValue("1408-WS·"
												+ docDirectory.getDirYear()
												+ "-"
												+ qiXian
												+ "-"
												+ fileNubmer.substring(
														fileNubmer.length() - 4,
														fileNubmer.length()));
									}else{
										cell.setCellValue("1120-WS·"
												+ docDirectory.getDirYear()
												+ "-"
												+ qiXian
												+ "-"
												+ fileNubmer.substring(
														fileNubmer.length() - 4,
														fileNubmer.length()));
									}
								} else {
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 1) {
								if(iter.getFileNo()!=null){
									cell.setCellValue(iter.getFileNo().replace("〔", "[").replace("〕", "]"));
								}else{
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell2"));
							} else if (j == 2) {
								if (iter.getFileIssup() != null) {
									cell.setCellValue(iter.getFileIssup());
									int n=iter.getFileIssup().length()/8;
									if(n>height){
										height=n;
									}
									row.setHeightInPoints((float) 12.5*(height+1));
								} else {
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell2"));
							} else if (j == 3) {
								cell.setCellValue(iter.getFileName());
								int n=iter.getFileName().length()/24;
								if(n>height){
									height=n;
									row.setHeightInPoints((float) 12.5*(height+1));
								}
								cell.setCellStyle(styles.get("cell2"));
							} else if (j == 4) {
								if (iter.getFileDate() != null) {
									cell.setCellValue(sf.format(iter.getFileDate())
											.toString());
								} else {
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 5) {
								cell.setCellValue(iter.getPageCount());
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 6) {
//								if (iter.getSecretLevel() != null&&iter.getSecretLevel().length()==2) {
//									cell.setCellValue(iter.getSecretLevel());
//								} else {
//									cell.setCellValue("");
//								}
								if (iter.getArchives()!= null&&iter.getArchives().getIsPublic()!= null&&iter.getArchives().getIsPublic().intValue()==3) {
									cell.setCellValue("公开");
								} else {
									cell.setCellValue("划控");
								}
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 7) {
								cell.setCellValue("");
								cell.setCellStyle(styles.get("cell1"));
							}
						}
						rownum++;
					}
				}
				
//				Row titleRow2 = sheet1.createRow(rownum);
//				titleRow2.setHeightInPoints((float) 50);
//				Cell titleCell2 = titleRow2.createCell(0);
//				titleCell2.setCellValue("B1  归档文件目录");
//				titleCell2.setCellStyle(styles.get("header0"));
//				sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$"+(rownum+1)+":$H$"+(rownum+1)));
				// sheet1.setColumnWidth(0, (short)50);
				// sheet1.autoSizeColumn(0);
				// 使用apache的commons-lang.jar产生随机的字符串作为文件名
				String fileName = RandomStringUtils.randomAlphanumeric(10);
				// 生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
				StringBuffer sb = new StringBuffer(fileName);

				final File file = new File(sb.append(".xls").toString());
				try {
					OutputStream os = new FileOutputStream(file);
					try {
						wb.write(os);
						os.close();
					} catch (IOException e) {
						e.printStackTrace();
					}

				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}

				try {
					is = new FileInputStream(file);
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}
			}
			return is;// 返回的是一个输入流
		}else{
			SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd ");
			HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
			InputStream is = null;
			for (int k = 0; k < wbs.length; k++) {
				// 1.新建一个Excel模板
				HSSFWorkbook wb = wbs[k];
				Map<String, CellStyle> styles = createStyles(wb);
				CreationHelper createHelper = wb.getCreationHelper();
				// 2.新建第一个sheet
				HSSFSheet sheet1 = wb.createSheet("sheet1");
				sheet1.setPrintGridlines(true);
				sheet1.setDefaultRowHeightInPoints((float) 50);
				PrintSetup printSetup = sheet1.getPrintSetup();
				printSetup.setUsePage(true);
				printSetup.setPageStart((short) 1);
				// A4纸张
				printSetup.setPaperSize((short) 9);
				// 打印方向:true，横打；false，竖打
				printSetup.setLandscape(false);
				HSSFFooter footer = sheet1.getFooter();
				footer.setCenter(HSSFHeader.fontSize((short) 13) + "第 "
						+ HSSFFooter.page() + " 页,　共 " + HSSFFooter.numPages()
						+ " 页");
				// sheet1.setFitToPage(true);
				sheet1.setHorizontallyCenter(true);
				// title row
				Row titleRow = sheet1.createRow(0);
				titleRow.setHeightInPoints((float) 47.25);
				Cell titleCell = titleRow.createCell(0);
				titleCell.setCellValue("归 档 文 件 目 录");
				titleCell.setCellStyle(styles.get("title"));
				sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$G$1"));
				Row headerRow1 = sheet1.createRow(1);
				headerRow1.setHeightInPoints(24);
				Cell headerCell1;
				// header1 第1列
				headerCell1 = headerRow1.createCell(0);
				headerCell1.setCellValue("年度:");
				headerCell1.setCellStyle(styles.get("header1"));

				// header1 第2列
				headerCell1 = headerRow1.createCell(1);
				headerCell1.setCellValue(docDirectory.getDirYear());
				headerCell1.setCellStyle(styles.get("headCellFont1"));
				// header1 第3列
				headerCell1 = headerRow1.createCell(2);
				headerCell1.setCellValue("部门:");
				headerCell1.setCellStyle(styles.get("header1"));
				// header1 第4列
				headerCell1 = headerRow1.createCell(3);
				headerCell1.setCellStyle(styles.get("headCellFont1"));
				if (docDirectory.getDepartment() != null) {
					headerCell1.setCellValue(docDirectory.getDepartment()
							.getDepName());
				} else {
					headerCell1.setCellValue("");
				}
				headerCell1 = headerRow1.createCell(4);
				headerCell1.setCellValue("保管期限:");
				headerCell1.setCellStyle(styles.get("header1"));
				// header1 第4列
				headerCell1 = headerRow1.createCell(5);
				headerCell1.setCellStyle(styles.get("headCellFont1"));
				if (docDirectory.getRetentionYear() == 0) {
					headerCell1.setCellValue("永久");
				} else if (docDirectory.getRetentionYear() == 1) {
					headerCell1.setCellValue("待分类");
				} else if (docDirectory.getRetentionYear() == 10) {
					headerCell1.setCellValue("10年");
				} else {
					headerCell1.setCellValue("30年");
				}
				sheet1.addMergedRegion(CellRangeAddress.valueOf("$F$2:$G$2"));
				// header2 row 第2行
				Row headerRow2 = sheet1.createRow(2);
				headerRow2.setHeightInPoints((float) 26.25);
				Cell headerCell2;
				// 第2行 第1列
				headerCell2 = headerRow2.createCell(0);
				headerCell2.setCellValue("件号");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(1);
				headerCell2.setCellValue("责任者");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(2);
				headerCell2.setCellValue("文号");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(3);
				headerCell2.setCellValue("题名");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(4);
				headerCell2.setCellValue("日期");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(5);
				headerCell2.setCellValue("页数");
				headerCell2.setCellStyle(styles.get("header2"));
				headerCell2 = headerRow2.createCell(6);
				headerCell2.setCellValue("备注");
				headerCell2.setCellStyle(styles.get("header2"));
				sheet1.setColumnWidth(0, (short) 7 * 255);
				sheet1.setColumnWidth(1, (short) 11 * 255);
				sheet1.setColumnWidth(2, (short) 11 * 255);
				sheet1.setColumnWidth(3, (short) 31 * 255);
				sheet1.setColumnWidth(4, (short) 12 * 255);
				sheet1.setColumnWidth(5, (short) 9 * 255);
				sheet1.setColumnWidth(6, (short) 7 * 255);
				Region region2 = new Region(2, (short) 0, 2, (short) 6);
				this.setRegionStyle(sheet1, region2, styles.get("header2"));
				sheet1.createFreezePane(7, 3);
				sheet1.createDrawingPatriarch();
				int rownum = 3;

				Cell cell = null;
				if (list != null && list.size() > 0) {
					if (docDirectory.getIsMakeFileNumber() != null
							&& "1".equals(docDirectory.getIsMakeFileNumber()
									.toString())) {
						Collections.sort(list, new Comparator() {
							public int compare(Object a, Object b) {
								int ret = 0;
								Long m1 = ((DocFiles) a).getFileNumber();
								Long m2 = ((DocFiles) b).getFileNumber();
								ret = m1.compareTo(m2);
								return ret;
							}
						});
					}
					for (DocFiles iter : list) {
						Row row = sheet1.createRow(rownum);
						row.setHeightInPoints((float) 50);
						for (int j = 0; j < 6; j++) {
							cell = row.createCell(j);
							if (j == 0) {
								if (iter.getFileNumber() != null) {
									cell.setCellValue(iter.getFileNumber());
								} else {
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 1) {
								if (iter.getFileIssup() != null) {
									cell.setCellValue(iter.getFileIssup());
								} else {
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell2"));
							} else if (j == 2) {
								cell.setCellValue(iter.getFileNo());
								cell.setCellStyle(styles.get("cell2"));
							} else if (j == 3) {
								cell.setCellValue(iter.getFileName());
								cell.setCellStyle(styles.get("cell2"));
							} else if (j == 4) {
								if (iter.getFileDate() != null) {
									cell.setCellValue(sf.format(iter.getFileDate())
											.toString());
								} else {
									cell.setCellValue("");
								}
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 5) {
								cell.setCellValue(iter.getPageCount());
								cell.setCellStyle(styles.get("cell1"));
							} else if (j == 6) {
								cell.setCellValue("");
							}
						}
						rownum++;
					}
				}
				// sheet1.setColumnWidth(0, (short)50);
				// sheet1.autoSizeColumn(0);
				// 使用apache的commons-lang.jar产生随机的字符串作为文件名
				String fileName = RandomStringUtils.randomAlphanumeric(10);
				// 生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
				StringBuffer sb = new StringBuffer(fileName);

				final File file = new File(sb.append(".xls").toString());
				try {
					OutputStream os = new FileOutputStream(file);
					try {
						wb.write(os);
						os.close();
					} catch (IOException e) {
						e.printStackTrace();
					}

				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}

				try {
					is = new FileInputStream(file);
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}
			}
			return is;// 返回的是一个输入流
		}

	}

	/**
	 * Create a library of cell styles
	 */
	private static Map<String, CellStyle> createStyles(Workbook wb) {
		Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
		CellStyle style;
		Font titleFont = wb.createFont();
		titleFont.setFontHeightInPoints((short) 28);
		titleFont.setFontName("黑体");
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(titleFont);
		styles.put("title", style);
		
		Font monthFont0 = wb.createFont();
		monthFont0.setFontHeightInPoints((short) 16);
		monthFont0.setFontName("宋体");
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(monthFont0);
		style.setWrapText(true);
		styles.put("header0", style);
		
		Font monthFont1 = wb.createFont();
		monthFont1.setFontHeightInPoints((short) 11);
		monthFont1.setFontName("黑体");
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(monthFont1);
		style.setWrapText(true);
		styles.put("header1", style);

		Font monthFont2 = wb.createFont();
		monthFont2.setFontHeightInPoints((short) 12);
		monthFont2.setFontName("宋体");
		monthFont2.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(monthFont2);
		style.setWrapText(true);
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setBorderRight(CellStyle.BORDER_THIN);
		styles.put("header2", style);

		Font headCellFont1 = wb.createFont();
		headCellFont1.setFontHeightInPoints((short) 11);
		headCellFont1.setFontName("黑体");
		style = wb.createCellStyle();
		style.setFont(headCellFont1);
		style.setAlignment(CellStyle.ALIGN_LEFT);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		styles.put("headCellFont1", style);

		Font cellFont1 = wb.createFont();
		cellFont1.setFontHeightInPoints((short) 9);
		cellFont1.setFontName("宋体");
		style = wb.createCellStyle();
		style.setFont(cellFont1);
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setBorderRight(CellStyle.BORDER_THIN);
		styles.put("cell1", style);

		Font cellFont2 = wb.createFont();
		cellFont2.setFontHeightInPoints((short) 9);
		cellFont2.setFontName("宋体");
		style = wb.createCellStyle();
		style.setFont(cellFont2);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setBorderRight(CellStyle.BORDER_THIN);
		styles.put("cell2", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setDataFormat(wb.createDataFormat().getFormat("0.00%"));
		styles.put("formula", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
		styles.put("formula_2", style);
		// 第0列样式
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("cell0", style);

		return styles;
	}

	private void setRegionStyle(HSSFSheet sheet, Region region, CellStyle cs) {
		int toprowNum = region.getRowFrom();
		for (int i = region.getRowFrom(); i <= region.getRowTo(); i++) {
			HSSFRow row = HSSFCellUtil.getRow(i, sheet);
			for (int j = region.getColumnFrom(); j <= region.getColumnTo(); j++) {
				HSSFCell cell = HSSFCellUtil.getCell(row, (short) j);
				cell.setCellStyle(cs);
			}
		}
	}

	/**
	 * 更新行号
	 * 
	 * @param schemaCode
	 * @param directoryId
	 * @param rowNumber
	 *            add by sicen.liu/2014.10.29
	 */
	public void updateRowNumber(String schemaCode, Long directoryId,
			Long rowNumber, Long preRowNumber) {
		dao.updateRowNumber(schemaCode, directoryId, rowNumber, preRowNumber);
	}

	/**
	 * 档案管理更新件号 add by sicen.liu/2014.10.30
	 */
	public void updateFileNumber(String schemaCode, Long directoryId,
			Long fileNumber) {
		dao.updateFileNumber(schemaCode, directoryId, fileNumber);
	}

	/**
	 * 档案管理更新行号，重新刷新 add by sicen.liu/2014.11.03
	 */
	public void refreshRowNumber(String schemaCode, Long directoryId) {
		dao.refreshRowNumber(schemaCode, directoryId);
	}
}
