package com.gdssoft.oa.service.archive.impl;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.collections.ListUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
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

import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessActivityAssistant;
import com.gdssoft.oa.dao.archive.ArchivesDao;
import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.job.DateUtil2;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.model.archive.OdCommonComments;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.work.WorkContent;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.OdCommonCommentsService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.WordSegmentTool;
import com.gdssoft.core.web.paging.PagingBean;

public class ArchivesServiceImpl extends BaseServiceImpl<Archives> implements
		ArchivesService {
	public static final String HOST = "http://10.224.5.183:8080/cq_search";
	public static final String SCORE = "JW_ARCHIVES_COPY_SEND";
	public static final String QT = "select";
	public static final String SHEADER = HOST + "/" + SCORE + "/" + QT;
	public static String EMPTY_RESULT = "[]";
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private ArchivesDocService archivesDocService;
	@Resource
	private OdCommonCommentsService odCommonCommentsService;
	private ArchivesDao dao;
	
	@Resource
	private AppUserService appUserService;
	
	@Resource
	private SmsMobileService smsMobileService;
	
	@Resource
	private AppUserDao appUserDao;

	public ArchivesServiceImpl(ArchivesDao dao) {
		super(dao);
		this.dao = dao;
	}

	private Log logger = LogFactory.getLog(ArchivesServiceImpl.class);

	@Override
	public List<Archives> findByUserOrRole(Long userId, Set<AppRole> roles,
			PagingBean pb) {
		return dao.findByUserOrRole(userId, roles, pb);
	}

	/**
	 * 启动子流程
	 * 
	 * @param defId
	 * @param archives
	 * @param processName
	 * @param activityName
	 * @param flowAssignIds
	 * @param createUser
	 *            子流程发起人
	 * @return
	 */
	public String startArchiveSubFlow(Long defId, Archives archives,
			String processName, String activityName, String flowAssignIds,
			AppUser createUser) {
		String piId = "";
		try {
			Archives archivesTemp = new Archives();
			Map<String, ParamField> fieldMap = constructStartFlowMap(archives,
					defId, processName, activityName);

			ProDefinition proDefintion = null;
			try {
				proDefintion = proDefinitionService.get(defId);
			} catch (Exception e) {
				logger.error("-------proDefintion =proDefinitionService.get(defId):"
						+ e);
			}
			if (proDefintion != null) {
				ProcessRun processRun = processRunService.initNewSubProcessRun(
						proDefintion, createUser);
				// 流程的启动表单信息
				ProcessForm processForm = new ProcessForm();
				processForm.setActivityName(activityName);
				processForm.setProcessRun(processRun);

				// 流程启动的信息
				FlowRunInfo runInfo = new FlowRunInfo();
				runInfo.setParamFields(fieldMap);
				runInfo.setdAssignId(flowAssignIds);
				runInfo.setStartFlow(true);
				System.out.println("userId;" + runInfo.getUserId());
				// 启动流程
				piId = processRunService.saveSubProcessRun(processRun,
						processForm, runInfo, createUser);

			}
			return piId;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("startArchiveSubFlow  error! " + e);
		}
		return null;
	}

	protected Map<String, ParamField> constructStartFlowMap(Archives archives,
			Long defId, String processName, String activityName) {

		Map<String, ParamField> map = ProcessActivityAssistant
				.constructFieldMap(processName, activityName);

		ParamField archivesId = map.get("archives.archivesId");
		if (archivesId != null) {
			archivesId.setName(archivesId.getName().replace(".", "_"));
			archivesId.setValue(String.valueOf(archives.getArchivesId()));
		}
		// 发文人id
		ParamField issuerId = map.get("issuerId");
		if (issuerId != null) {
			issuerId.setValue(String.valueOf(archives.getIssuerId()));
		}
		// 主题
		ParamField subject = map.get("archives.subject");
		if (subject != null) {
			subject.setName(subject.getName().replace(".", "_"));
			subject.setValue(String.valueOf(archives.getSubject()));
		}

		ParamField issueDep = map.get("archives.issueDep");
		if (issueDep != null) {
			issueDep.setName(issueDep.getName().replace(".", "_"));
			issueDep.setValue(String.valueOf(archives.getIssueDep()));
		}

		ParamField issuer = map.get("archives.issuer");
		if (issuer != null) {
			issuer.setName(issuer.getName().replace(".", "_"));
			issuer.setValue(String.valueOf(archives.getIssuer()));
		}
		ParamField recDepNames = map.get("archives.recDepNames");
		if (recDepNames != null) {
			recDepNames.setName(recDepNames.getName().replace(".", "_"));
			recDepNames.setValue(String.valueOf(archives.getRecDepNames()));
		}
		return map;
	}

	/**
	 * 通过流程实例Id获得公文对象实体
	 * 
	 * @return
	 */
	public Archives getArchivesByRunId(Long runId) {
		return dao.getArchivesByRunId(runId);
	}

	@Override
	public List<Archives> getCC(HttpServletRequest request, Long userId,
			String defId, String archivesNo, String depName, String subject) {
		// TODO Auto-generated method stub
		return dao.getCC(request, userId, defId, archivesNo, depName, subject);
	}

	@Override
	public List<Archives> getArchivesByParentId(Long parentId) {
		return dao.getArchivesByParentId(parentId);
	}

	@Override
	public boolean startSubProcess(AppUser createUser, Long archiveId,
			Long defId, Archives archives, String processName,
			String startNodeName,
			ArrayList<Map<String, String>> flowAssignIdList) {
		try {
			this.logger
					.debug("-------------flowAssignIdList.size----------------:"
							+ flowAssignIdList.size());
			this.logger
					.debug("-------------预启动-------------------------------:"
							+ flowAssignIdList.size() + "个子流程");
			int i = 0;
			for (Map<String, String> map : flowAssignIdList) {

				try {
					// 启动子流程实例 得到流程实例ID
					String piId = null;
					try {
						piId = archivesService.startArchiveSubFlow(defId,
								archives, processName, startNodeName,
								map.get("flowAssignIds"), createUser);
					} catch (Exception e) {
						// TODO: handle exception
						logger.error("archivesService.startArchiveSubFlow error! "
								+ e);
					}
					if (null != piId) {// 如果启动流程成功
						i++;
						Archives subArchives = saveSubData(archiveId, archives,
								map.get("recDepName"));
						// 更新子流程数据的流程实例ID
						updateRunId(subArchives.getArchivesId(), piId);// 55
						this.logger
								.debug("-------success start sub process------ "
										+ map.get("recDepName"));
						if (subArchives.getProcessRun() != null) {
							ProcessRun processRun = null;
							try {
								processRun = processRunService.get(subArchives
										.getProcessRun().getRunId());
							} catch (Exception e) {
								// TODO: handle exception
								logger.error("processRunService.get(subArchives.getProcessRun().getRunId()) error!"
										+ e);
							}
							if (subArchives.getSubject() == null) {
								processRun.setSubject(subArchives.getSubject()
										+ "--" + subArchives.getRecDepNames());
							} else {
								processRun.setSubject(subArchives.getSubject()
										+ "--" + subArchives.getRecDepNames());
							}
							Archives parArchives = archivesService
									.get(archiveId);
							if (parArchives.getProcessRun() != null) {
								processRun.setParentId(parArchives
										.getProcessRun().getRunId());
							}
							processRunService.save(processRun);
						}
					} else {
						logger.warn(map.get("recDepName") + "流程启动失败！");
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					logger.error("for (Map<String,String> map : flowAssignIdList) "
							+ e);
				}

			}
			this.logger.debug("成功启动了" + i + "个子流程");
			return true;
		} catch (Exception e) {
			this.logger.debug("-----------error------------:" + e);
		}
		return false;
	}

	public void updateRunId(Long archivesId, String runId) {
		ProcessRun processRun = processRunService.get(new Long(runId));
		Archives archives = archivesService.get(archivesId);
		archives.setProcessRun(processRun);
		archivesService.save(archives);
	}

	/**
	 * 保存子流程数据
	 * 
	 * @return
	 */
	public Archives saveSubData(Long archiveId, Archives archives,
			String recDepName) {

		try {
			List<ArchivesDoc> list = archivesDocService.findByAid(archiveId);
			Archives orgArchives = new Archives();

			BeanUtil.copyNotNullProperties(orgArchives, archives);

			orgArchives.setParentArchId(archiveId);
			orgArchives.setArchType((short) 1);
			orgArchives.setStatus((short) 1);
			orgArchives.setArchivesId(null);
			orgArchives.setArchivesDocs(null);
			orgArchives.setArchivesDeps(null);
			orgArchives.setArchivesHandles(null);
			orgArchives.setLeaders(null);
			orgArchives.setArchivesDispatch(null);
			orgArchives.setArchivesAttends(null);
			orgArchives.setArchivesCCs(null);
			orgArchives.setRecDepNames(recDepName);
			orgArchives = archivesService.save(orgArchives);
			for (ArchivesDoc ad : list) {
				ArchivesDoc archivesDoc = new ArchivesDoc();

				BeanUtil.copyNotNullProperties(archivesDoc, ad);

				archivesDoc.setDocId(null);
				archivesDoc.setDocHistorys(null);
				archivesDoc.setArchives(orgArchives);
				archivesDoc.setArchivesId(orgArchives.getArchivesId());
				archivesDocService.save(archivesDoc);
			}
			return orgArchives;
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			logger.debug("saveSubData error! " + e);
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			logger.debug("saveSubData error! " + e);
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			logger.debug("saveSubData error! " + e);
		}
		return null;
	}

	@Override
	public Long getArchId(Long runId) {

		return dao.getArchId(runId);
	}

	public List<FlowTaskReport> getFinishedFlow(final int archiveType,
			final String subject, final Long userId, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId,final String depSignNo,final String issuerName,final int startPage, final int pageSize,
			final String dir, final String sort) {
		return dao.getFinishedFlow(archiveType, subject, userId, defId,
				issuedep, orgdepId, startDate, endDate, archiveNo,
				privacyLevel, urgentLevel,snConfigId,depSignNo,issuerName, startPage, pageSize, dir, sort);
	}
	
	public List<FlowTaskReport> getIsStandardFinishedFlow(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId, final int startPage, final int pageSize) {
		return dao.getIsStandardFinishedFlow(archiveType, subject, defId,
				issuedep, orgdepId, startDate, endDate, archiveNo,
				privacyLevel, urgentLevel,snConfigId, startPage, pageSize);
	}
	
	/**
	 * 发文导出excel
	 */
	public InputStream sentlistToExcel(List<FlowTaskReport> list){
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("发文库");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$F$1"));
			
			Region region= new Region(0, (short)0, 1, (short)5);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			
			
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(1);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第2行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("标题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			//headerCell2.setCellValue("主办部门");
			//headerCell2.setCellStyle(styles.get("header"));
			//headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("发文单位");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("发文编号");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			//headerCell2.setCellValue("来文号");
			//headerCell2.setCellStyle(styles.get("header"));
			//headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("拟稿日期");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("签发日期");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.setColumnWidth(0, (short)10000);
			sheet1.setColumnWidth(1, (short)15000);
			sheet1.setColumnWidth(2, (short)7000);
			sheet1.setColumnWidth(3, (short)6000);			
			sheet1.setColumnWidth(4, (short)5000);
			sheet1.setColumnWidth(5, (short)5000);
			Region region2= new Region(1, (short)1, 2, (short)5);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 2;
					
			Cell cell = null;
			for (FlowTaskReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 6; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getFlowName());
	                }else if(j==1){
	                	cell.setCellValue(iter.getRunSubject());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getIssuedep());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getArchivesNo());
	                }else if(j == 4){	     
	                	cell.setCellValue(iter.getArchCreateTime().toString());
	                }else if(j == 5){
	                	if (iter.getSignDate()!=null) {
	                		cell.setCellValue(iter.getSignDate().toString());
						}else {
							cell.setCellValue("");
						}
	                	
	                }
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			//sheet1.autoSizeColumn(0);
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
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
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	
	/**
	 * 规范性文件库导出
	 * 
	 * @param list
	 * @return
	 */
	public InputStream isStandardSentlistToExcel(List<FlowTaskReport> list){
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("规范性文件库");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$F$1"));
			
			Region region= new Region(0, (short)0, 1, (short)5);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			
			
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(1);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第2行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("标题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			//headerCell2.setCellValue("主办部门");
			//headerCell2.setCellStyle(styles.get("header"));
			//headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("发文单位");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("发文编号");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			//headerCell2.setCellValue("来文号");
			//headerCell2.setCellStyle(styles.get("header"));
			//headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("拟稿日期");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("签发日期");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.setColumnWidth(0, (short)10000);
			sheet1.setColumnWidth(1, (short)15000);
			sheet1.setColumnWidth(2, (short)7000);
			sheet1.setColumnWidth(3, (short)6000);			
			sheet1.setColumnWidth(4, (short)5000);
			sheet1.setColumnWidth(5, (short)5000);
			Region region2= new Region(1, (short)1, 2, (short)5);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 2;
					
			Cell cell = null;
			for (FlowTaskReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 6; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getFlowName());
	                }else if(j==1){
	                	cell.setCellValue(iter.getRunSubject());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getIssuedep());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getArchivesNo());
	                }else if(j == 4){	     
	                	cell.setCellValue(iter.getArchCreateTime().toString());
	                }else if(j == 5){
	                	if (iter.getSignDate()!=null) {
	                		cell.setCellValue(iter.getSignDate().toString());
						}else {
							cell.setCellValue("");
						}
	                	
	                }
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			//sheet1.autoSizeColumn(0);
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
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
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	
	/**
	 * 收文导出excel
	 */
	public InputStream receivelistToExcel(List<FlowTaskReport> list){
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("收文库");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$H$1"));
			
			Region region= new Region(0, (short)0, 1, (short)7);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			
			
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(1);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第2行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("标题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("主办部门");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("来文单位");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("收文编号");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("来文号");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("收文日期");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("成文日期");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.setColumnWidth(0, (short)8500);
			sheet1.setColumnWidth(1, (short)12000);
			sheet1.setColumnWidth(2, (short)5000);
			sheet1.setColumnWidth(3, (short)7000);			
			sheet1.setColumnWidth(4, (short)5000);
			sheet1.setColumnWidth(5, (short)5000);
			sheet1.setColumnWidth(6, (short)5000);
			sheet1.setColumnWidth(7, (short)5000);
			Region region2= new Region(1, (short)1, 2, (short)7);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 2;
					
			Cell cell = null;
			for (FlowTaskReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 8; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getFlowName());
	                }else if(j==1){
	                	cell.setCellValue(iter.getRunSubject());
	                }else if (j==2) {
	                	cell.setCellValue(iter.getOrgdepName());
					}else if(j == 3){
	                	cell.setCellValue(iter.getIssuedep());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getArchivesNo());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getDepSignNo());
	                }else if(j == 6){	     
	                	cell.setCellValue(iter.getIssueDate().toString());
	                }else if(j == 7){
	                	if(null == iter.getWrittenDate()){
	                		cell.setCellValue("");
	                	}else{
	                		cell.setCellValue(iter.getWrittenDate().toString());
	                	}
	                }
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			//sheet1.autoSizeColumn(0);
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
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
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findArchives(short archiveType,short status,String startDate,String endDate){
		return dao.findArchives(archiveType, status,startDate,endDate);
	}
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findAllSchemaArchives(String schemaCode,short archiveType,short status,String startDate,String endDate){
		return dao.findAllSchemaArchives(schemaCode, archiveType, status, startDate, endDate);
	}
	public List<Archives> findoverdueArchives(String schemaCode,short archiveType,short status,String startDate,String endDate){
		return dao.findOverdueArchives(schemaCode, archiveType, status, startDate, endDate);
	}
	/**
	 * Create a library of cell styles
	 */
	private static Map<String, CellStyle> createStyles(Workbook wb) {
		Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
		CellStyle style;
		Font titleFont = wb.createFont();
		titleFont.setFontHeightInPoints((short) 14);
		titleFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(titleFont);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("title", style);

		Font monthFont = wb.createFont();
		monthFont.setFontHeightInPoints((short) 11);
		//monthFont.setColor(IndexedColors.WHITE.getIndex());
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setFont(monthFont);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("header", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
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
		styles.put("cell", style);

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
		//第0列样式
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
	
	private void setRegionStyle(HSSFSheet sheet, Region region , CellStyle cs) {
        int toprowNum = region.getRowFrom();
        for (int i = region.getRowFrom(); i <= region.getRowTo(); i ++) {
            HSSFRow row = HSSFCellUtil.getRow(i, sheet);
            for (int j = region.getColumnFrom(); j <= region.getColumnTo(); j++) {
                HSSFCell cell = HSSFCellUtil.getCell(row, (short)j);
                cell.setCellStyle(cs);
            }
        }
    }

	@Override
	public Archives getArchivesByRunIdAndSchema(String schema, Long runId) {
		return dao.getArchivesByRunIdAndSchema(schema, runId);
	}
	@Override
	public List<OdArchivescc> listCC(Long userId, String archivesNo, String depSignNo,
			String subject, int status, int start, int size){
		return dao.listCC(userId, archivesNo, depSignNo, subject, status, start, size);
	}
	@Override
	public Long count(Long userId, String archivesNo, String depSignNo,
			String subject, int status){
		return dao.count(userId, archivesNo, depSignNo, subject, status);
	}
	@Override
	public Long getrun(Long archivesId,String schemacode){
		return dao.getrun(archivesId,schemacode);
	}
	/*调用搜索引擎查询抄送给我的公文*/
	@Override
	public List<OdArchivescc> listCCJW(Long userId, String archivesNo, String depSignNo,
			String subject, int status, int start, int size){	String url = null;
			try {
				url = SHEADER
						+ "?"
						+ getParamForQuerySubjectAndDocnum(userId, archivesNo,
								depSignNo, subject, status);
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// url中设定的wt=json 指定结果为json。start与rows用于分页
			url += "&start=" + start + "&rows=" + (size)
					+ "&wt=json&indent=true";
			String result = null;
			try {
				result = call(url);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			JSONObject all = JSONObject.fromObject(result);
			// 解析一般下获取response节点
			JSONObject res = all.getJSONObject("response");
			// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
			int total = res.getInt("numFound");
			// 获取最终结果
			JSONArray docs = res.getJSONArray("docs");
			List<OdArchivescc> resultList = tranFromJSONObject(docs);
			return resultList;
			}
	/**
	 * 调用搜索引擎获取收发文待办及在办件查出总数
	 * 
	 * @return
	 */
	@Override
	public int count(Long userId, String archivesNo, String depSignNo,
			String subject, int status, int start, int size) {

		String url = null;
		try {
			url = SHEADER
					+ "?"
					+ getParamForQuerySubjectAndDocnum(userId, archivesNo,
							depSignNo, subject, status);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// url中设定的wt=json 指定结果为json。start与rows用于分页
		url += "&start=" + 0 + "&rows=" + 10
				+ "&wt=json&indent=true";
		String result = null;
		try {
			result = call(url);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JSONObject all = JSONObject.fromObject(result);
		// 解析一般下获取response节点
		JSONObject res = all.getJSONObject("response");
		// 结果一般在docs节点下，但是response节点下也有其它有用的节点，比如可以获取结果的总数
		int total = res.getInt("numFound");
		// 获取最终结果
		int count = total;
		return count;
	}

	public static String call(String url) throws IOException {
		// 創建一個鏈接遠端服務的客戶端
		HttpURLConnection httpurlconnection = null;
		// String temourl=java.net.URLEncoder.encode(url.toString(),
		// "ISO-8859-1");
		// URL my_url = new URL(temourl);
		URL my_url = new URL(url);
		httpurlconnection = (HttpURLConnection) my_url.openConnection();
		httpurlconnection.setDoOutput(true);
		httpurlconnection.setRequestMethod("GET");
		httpurlconnection.setRequestProperty("Content-type",
				"text/xml; charset=UTF-8");
		// 接受結果
		BufferedReader br = new BufferedReader(new InputStreamReader(
				httpurlconnection.getInputStream(), "UTF-8"));
		StringBuilder stringBulider = new StringBuilder();
		String linerep = null;
		while ((linerep = br.readLine()) != null) {
			stringBulider.append(linerep);
		}
		br.close();
		br = null;
		return stringBulider.toString();
	}

	private String getParamForQuerySubjectAndDocnum(Long userId, String archivesNo, String depSignNo,
			String subject, int status)
			throws UnsupportedEncodingException {
		WordSegmentTool wordSegmentTool=new WordSegmentTool();
		StringBuffer param = new StringBuffer();
		String AND = " AND ";
		String TO = " TO ";
		param.append("q=");
		param.append("*:*");
		if (null != userId && !"".equals(userId)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("userId:");
			param.append(java.net.URLEncoder.encode(userId.toString(), "utf-8"));
		}
		if (null != archivesNo && !"".equals(archivesNo)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("archivesNo:");
			param.append(java.net.URLEncoder.encode(archivesNo, "utf-8"));
		}
		if (null != depSignNo && !"".equals(depSignNo)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("depSignNo:");
			param.append(java.net.URLEncoder.encode(depSignNo, "utf-8"));
		}
		if (null != subject && !"".equals(subject)) {
			String putWord="";
			try {
				putWord=wordSegmentTool.segmentWord(subject);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("subject:");
			param.append(java.net.URLEncoder.encode(putWord, "utf-8"));
		}
		if ( !"".equals(status)) {
			param.append(java.net.URLEncoder.encode(AND, "utf-8"));
			param.append("status:");
			param.append(java.net.URLEncoder.encode(String.valueOf(status), "utf-8"));
		}
		return param.toString();
	}

	/* 把搜索引擎查到的数据添加进新的model中 */
	private static List<OdArchivescc> tranFromJSONObject(JSONArray array) {
		List<OdArchivescc> archs = new ArrayList<OdArchivescc>();
		for (int i = 0; i < array.size(); i++) {
			OdArchivescc arch = new OdArchivescc();
			try {
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
				JSONObject json = array.getJSONObject(i);
				arch.setArchivesId(new Long(getValueByName(json, "archivesid")));
				arch.setId(new Long(getValueByName(json, "id")));
				arch.setSubject(getValueByName(json,
						"subject"));
				arch.setIssuer(getValueByName(json, "issuer"));
				arch.setCreatetime(formatter.parse(getValueByName(json, "createtime")));
				arch.setRunId(new Long(getValueByName(json, "runid")));
				arch.setDefId(new Long(getValueByName(json, "defid")));
				arch.setStatus(new Short(getValueByName(json, "status")));
				arch.setTaskName(getValueByName(json, "activityname"));
				arch.setAssignUserName(getValueByName(json, "fullname"));
				archs.add(arch);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return archs;
	}

	// 獲取屬性的值
	public static String getValueByName(JSONObject json, String pName) {
		String result = "";
		try {
			if (json != null) {
				result = json.getString(pName);
			}
		}
		// 處理異常
		catch (Exception e) {
			result = "";
		} finally {
			return result;
		}
	}
	
	public InputStream transferlistToExcel(List<SysDataTransfer> list){

		QueryFilter filter2=new QueryFilter();
		PagingBean pageBean = new PagingBean(0, 100);
		filter2.setPagingBean(pageBean);
		filter2.getPagingBean().setPageSize(100000);
		filter2.addFilter("Q_ref1_S_EQ", "3");
		filter2.addSorted("id", "asc");
		List<OdCommonComments> list2=odCommonCommentsService.getAll(filter2);
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("退文统计");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$G$1"));
			
			Region region= new Region(0, (short)0, 1, (short)6);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			
			
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(1);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第2行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("来文单位");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("成文日期");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("公文字号");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("公文标题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("退文时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("错情原因");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("退文详情");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.setColumnWidth(0, (short)8500);
			sheet1.setColumnWidth(1, (short)12000);
			sheet1.setColumnWidth(2, (short)5000);
			sheet1.setColumnWidth(3, (short)7000);			
			sheet1.setColumnWidth(4, (short)5000);
			sheet1.setColumnWidth(5, (short)5000);
			sheet1.setColumnWidth(6, (short)5000);
			Region region2= new Region(1, (short)1, 2, (short)6);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 2;
					
			Cell cell = null;
			for (SysDataTransfer iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 7; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getSendDep());
	                }else if(j==1){
	                	cell.setCellValue(iter.getWrittenDate().toString());
	                }else if (j==2) {
	                	cell.setCellValue(iter.getArchivesno());
					}else if(j == 3){
	                	cell.setCellValue(iter.getSubject());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getCreateDate().toString());
	                }else if(j == 5){
	                	String str="";
	                	for(OdCommonComments odc:list2){
	                		if(iter.getTransferType()!=null&&iter.getTransferType().equals(odc.getId())){
	                			str=odc.getCommentTitle();
	                			break;
	                		}
	                	}
	                	cell.setCellValue(str);
	                }else if(j == 6){	     
	                	cell.setCellValue(iter.getRejectMsg());
	                }
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			//sheet1.autoSizeColumn(0);
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
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
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	/**
	 * 交委行政、党委规范性文件查询
	 * 
	 * @param archiveType
	 * @param subject
	 * @param defId
	 * @param issuedep
	 * @param orgdepId
	 * @param startDate
	 * @param endDate
	 * @param archiveNo
	 * @param privacyLevel
	 * @param urgentLevel
	 * @param snConfigId
	 * @param isStandard
	 * @param examineRecordNumber
	 * @param startPage
	 * @param pageSize
	 * @return
	 */
	public List<FlowTaskReport> getIsStandardFinishedFlowJW(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId, final Long isStandard, 
			final String keywords, final int startPage, final int pageSize) {
		return dao.getIsStandardFinishedFlowJW(archiveType, subject, defId,
				issuedep, orgdepId, startDate, endDate, archiveNo,
				privacyLevel, urgentLevel,snConfigId, isStandard, keywords, startPage, pageSize);
	}
	
	public void sendSmsForStandardExpireJW() {
		String keywords1 = "10";
		long isComSetting1 = 0;
		String content1 = "（SUBJECT）为行政规范性文件，有效期将满，请您在两个月内完成评估，是否继续施行、修订或废止，并反馈委法规处。";
		String dateStrStart1 = DateUtil2.dtSimpleYmdhms(
				DateUtil2.getStartTimeOfTheDate(DateUtil2.getDateByMonth(new Date(), -58)));
		String dateStrEnd1 = DateUtil2.dtSimpleYmdhms(
				DateUtil2.getStartTimeOfTheDate(DateUtil2.getDateByMonth(new Date(), -58)));
//		dateStrStart1 = "2017-09-15 00:00:00";
//		dateStrEnd1 = "2017-09-15 23:59:59";
		
		String keywords2 = "11";
		long isComSetting2 = 1;
		String content2 = "（SUBJECT）为行政规范性文件，有效期将满，请您在两个月内完成评估，是否正式施行、修订或废止，并反馈委法规处。需正式施行的应当重新发布正式文件。";
		String dateStrStart2 =  DateUtil2.dtSimpleYmdhms(
				DateUtil2.getStartTimeOfTheDate(DateUtil2.getDateByMonth(new Date(), -22)));
		String dateStrEnd2 =  DateUtil2.dtSimpleYmdhms(
				DateUtil2.getStartTimeOfTheDate(DateUtil2.getDateByMonth(new Date(), -22)));
//		dateStrStart2 = "2017-09-15 00:00:00";
//		dateStrEnd2 = "2017-09-15 23:59:59";
		
		// 行政不是试行或暂行文件
		sendSmsForStandardExpireJW(keywords1, dateStrStart1, dateStrEnd1, isComSetting1, content1);
		// 行政是试行或暂行文件
		sendSmsForStandardExpireJW(keywords1, dateStrStart2, dateStrEnd2, isComSetting2, content2);
		// 党委不是试行或暂行文件
		sendSmsForStandardExpireJW(keywords2, dateStrStart1, dateStrEnd1, isComSetting1, content1);
		// 党委是试行或暂行文件
		sendSmsForStandardExpireJW(keywords2, dateStrStart2, dateStrEnd2, isComSetting2, content2);
	}
	
	/**
	 * 党委、行政规范性文件发送短信
	 * 
	 * @param keywords
	 * 				行政 10，党委11
	 * @param dateStr
	 * 				生成电子公文时间 yyyy-MM-dd
	 * @param isComSetting
	 * 				是否是试行或暂行规范性文件 0,否，1是
	 * @param content
	 * 				短信内容
	 */
	public void sendSmsForStandardExpireJW(String keywords, String dateStart, String dateEnd, long isComSetting, String content) {
		// 1、查找行政、党委规范性文件
		String schema = "OA";
		Short isStandard = 1;
		Short runStatus = 2;
		List<Archives> list = dao.findArchives(schema, isStandard, runStatus, keywords, isComSetting, dateStart, dateEnd);
		for (Archives archives : list) {
			// 2、查找该文起草处室处长、副处长
			List<AppUser> listUser = appUserDao.findUserDirectorById(schema, archives.getIssuerId());
			if (listUser != null && listUser.size() > 0) {
				for (AppUser appUser : listUser) {
					// 3、短信通知
					if (logger.isDebugEnabled()) {
						logger.info("Notice " + appUser.getUserId());
					}
					smsMobileService.saveSms(schema, String.valueOf(appUser.getUserId()),
							content.replaceAll("SUBJECT", archives.getSubject()));
				}
			}
		}
	}
	
	public InputStream workContentListToExcel(List<WorkContent> list){
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("督查事项");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$E$1"));
			
			Region region= new Region(0, (short)0, 1, (short)4);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			
			
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(1);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第2行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("事项名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("责任部门");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("登记日期");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("限办日期");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("事项状态");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.setColumnWidth(0, (short)10000);
			sheet1.setColumnWidth(1, (short)7000);
			sheet1.setColumnWidth(2, (short)7000);
			sheet1.setColumnWidth(3, (short)6000);			
			sheet1.setColumnWidth(4, (short)5000);
			Region region2= new Region(1, (short)1, 2, (short)4);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 2;
					
			Cell cell = null;
        	SimpleDateFormat sf  = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss"); 
        	SimpleDateFormat sf2  = new SimpleDateFormat( "yyyy-MM-dd"); 
			for (WorkContent iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 5; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getName());
	                }else if(j==1){
	                	cell.setCellValue(iter.getDeptname());
	                }else if(j == 2){
	                	cell.setCellValue(sf.format(iter.getCreatetime()));
	                }else if(j == 3){
	                	cell.setCellValue(sf2.format(iter.getLimitdate()));
	                }else if(j == 4){
	                	int status=iter.getStatus();
	                	if(status==0){
		                	cell.setCellValue("办理中");
	                	}else{
	                		cell.setCellValue("已结束");
	                	}
	                }
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			//sheet1.autoSizeColumn(0);
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
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
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
}
